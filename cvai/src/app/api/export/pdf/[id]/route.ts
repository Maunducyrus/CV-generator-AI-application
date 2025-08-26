import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const doc = await prisma.document.findFirst({ where: { id: params.id, userId: user.id } });
  if (!doc) return new Response('Not found', { status: 404 });

  const pdf = new PDFDocument({ margin: 50, size: 'A4' });
  const chunks: Uint8Array[] = [];
  pdf.on('data', (c) => chunks.push(c));

  pdf.fontSize(20).text(doc.title, { align: 'left' });
  pdf.moveDown();
  pdf.fontSize(11).text(doc.content, { align: 'left' });
  pdf.end();

  await new Promise<void>((resolve) => pdf.on('end', () => resolve()));
  const buffer = Buffer.concat(chunks);
  return new Response(buffer, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${(doc.title || 'cv').replace(/[^a-z0-9-_]/gi, '_')}.pdf"`
    }
  });
}