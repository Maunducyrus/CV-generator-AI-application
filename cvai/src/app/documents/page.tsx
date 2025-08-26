"use client";
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DocumentsPage() {
  const { data, mutate } = useSWR('/api/documents', fetcher);

  const onShare = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/share`, { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      alert(`Share URL: ${json.url}`);
      mutate();
    }
  };

  if (!data) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Documents</h1>
        <Link href="/builder" className="text-sm text-brand">+ New</Link>
      </div>
      <div className="mt-6 grid gap-3">
        {data.map((d: any) => (
          <div key={d.id} className="border rounded-md p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-gray-500">{d.kind} • Updated {new Date(d.updatedAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link className="text-brand" href={`/builder?id=${d.id}`}>Open</Link>
              <button className="text-gray-700" onClick={() => onShare(d.id)}>Share</button>
              <Link className="text-gray-700" href={`/s/${d.token ?? ''}`}></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}