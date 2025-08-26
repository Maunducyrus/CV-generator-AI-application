"use client";
import useSWR from 'swr';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DocumentsPage() {
  const { data, mutate } = useSWR('/api/documents', fetcher);

  const onShare = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/share`, { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      navigator.clipboard?.writeText(json.url).catch(() => {});
      alert(`Share URL copied to clipboard: ${json.url}`);
      mutate();
    }
  };

  if (!data) return <div className="container py-8">Loading...</div>;

  if (data.length === 0) {
    return (
      <div className="container py-16 grid place-items-center text-center">
        <div>
          <h1 className="text-2xl font-semibold">No documents yet</h1>
          <p className="mt-2 text-gray-600 text-sm">Create your first AI-powered CV to get started.</p>
          <div className="mt-6">
            <Link href="/builder"><Button>Create document</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Documents</h1>
        <Link href="/builder" className="text-sm text-brand">+ New</Link>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {data.map((d: any) => (
          <Card key={d.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-gray-500">{d.kind} • Updated {new Date(d.updatedAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link className="text-brand" href={`/builder?id=${d.id}`}>Open</Link>
              <button className="text-gray-700" onClick={() => onShare(d.id)}>Share</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}