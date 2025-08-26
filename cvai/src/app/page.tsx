import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Build an impressive CV with AI</h1>
          <p className="mt-4 text-gray-600">Generate tailored CVs and cover letters, optimize for ATS, export to PDF/DOCX, and share online.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/builder" className="px-5 py-3 rounded-md bg-brand text-white">Start Building</Link>
            <Link href="/signin" className="px-5 py-3 rounded-md border">Sign in</Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <li>AI phrasing suggestions</li>
            <li>ATS optimization</li>
            <li>Multiple templates</li>
            <li>Export PDF/DOCX/TXT</li>
          </ul>
        </div>
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="aspect-[4/3] bg-gray-50 rounded-md grid place-items-center text-gray-500">CV Preview</div>
        </div>
      </div>
    </section>
  );
}