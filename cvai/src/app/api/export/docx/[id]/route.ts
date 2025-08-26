import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response('Unauthorized', { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response('Unauthorized', { status: 401 });
  const doc = await prisma.document.findFirst({ where: { id: params.id, userId: user.id } });
  if (!doc) return new Response('Not found', { status: 404 });

  const paragraphs = String(doc.content)
    .split('\n')
    .map((line) => new Paragraph({ children: [new TextRun(line)] }));

  const d = new Document({
    sections: [
      {
        properties: {},
        children: [new Paragraph({ children: [new TextRun({ text: doc.title, bold: true, size: 28 })] }), ...paragraphs]
      }
    ]
  });

  const buffer = await Packer.toBuffer(d);
  const body = new Uint8Array(buffer);
  return new Response(body, {
    headers: {
      'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'content-disposition': `attachment; filename="${(doc.title || 'cv').replace(/[^a-z0-9-_]/gi, '_')}.docx"`
    }
  });
}