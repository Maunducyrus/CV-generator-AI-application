import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const doc = await prisma.document.findFirst({ where: { id: params.id, userId: user.id } });
  if (!doc) return new Response('Not found', { status: 404 });
  return new Response(JSON.stringify(doc), { headers: { 'content-type': 'application/json' } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  const updated = await prisma.document.update({ where: { id: params.id }, data: { title: body.title, templateKey: body.templateKey, language: body.language, content: typeof body.content === 'string' ? body.content : JSON.stringify(body.content) } });
  return new Response(JSON.stringify(updated), { headers: { 'content-type': 'application/json' } });
}