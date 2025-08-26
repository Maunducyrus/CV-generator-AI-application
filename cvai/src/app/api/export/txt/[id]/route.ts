import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const doc = await prisma.document.findFirst({ where: { id: params.id, userId: user.id } });
  if (!doc) return new Response('Not found', { status: 404 });
  return new Response(doc.content, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-disposition': `attachment; filename="${(doc.title || 'cv').replace(/[^a-z0-9-_]/gi, '_')}.txt"`
    }
  });
}