import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const docs = await prisma.document.findMany({ where: { userId: user.id }, orderBy: { updatedAt: 'desc' } });
  return new Response(JSON.stringify(docs), { headers: { 'content-type': 'application/json' } });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const { title, kind = 'CV', templateKey = 'minimal', language = 'en', content } = await req.json();
  const doc = await prisma.document.create({ data: { userId: user.id, title, kind, templateKey, language, content: typeof content === 'string' ? content : JSON.stringify(content) } });
  return new Response(JSON.stringify(doc), { headers: { 'content-type': 'application/json' } });
}