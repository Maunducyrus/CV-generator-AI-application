import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password) return new Response('Missing fields', { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return new Response('Email in use', { status: 400 });
  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });
  return new Response('OK');
}