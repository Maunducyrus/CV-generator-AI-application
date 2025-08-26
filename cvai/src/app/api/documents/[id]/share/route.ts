import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return new Response('Not found', { status: 404 });
  const token = randomBytes(12).toString('hex');
  await prisma.shareLink.create({ data: { documentId: doc.id, token } });
  const url = `${process.env.NEXTAUTH_URL?.replace(/\/$/, '') || ''}/s/${token}`;
  return new Response(JSON.stringify({ token, url }), { headers: { 'content-type': 'application/json' } });
}