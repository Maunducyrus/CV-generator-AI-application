import { prisma } from '@/lib/prisma';

export default async function SharePage({ params }: { params: { token: string } }) {
  const link = await prisma.shareLink.findUnique({ where: { token: params.token }, include: { document: true } });
  if (!link?.document) return <div className="mx-auto max-w-3xl px-4 py-12">Not found</div>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">{link.document.title}</h1>
      <article className="prose prose-neutral max-w-none mt-6 whitespace-pre-wrap">
        {link.document.content}
      </article>
    </div>
  );
}