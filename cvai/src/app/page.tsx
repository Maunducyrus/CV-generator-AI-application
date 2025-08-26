import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <section className="container py-16">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-brand">AI Resume & Cover Letter</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Build an impressive CV with AI</h1>
          <p className="mt-4 text-gray-600">Generate tailored CVs and cover letters, optimize for ATS, export to PDF/DOCX, and share online.</p>
          <div className="mt-8 flex gap-3">
            <Link href="/builder"><Button>Start Building</Button></Link>
            <Link href="/documents"><Button variant="secondary">View Documents</Button></Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div>AI phrasing suggestions</div>
            <div>ATS optimization</div>
            <div>Multiple templates</div>
            <div>Export PDF/DOCX/TXT</div>
          </div>
        </div>
        <Card className="p-6">
          <div className="aspect-[4/3] rounded-md bg-gradient-to-br from-white to-blue-50 grid place-items-center text-gray-500">
            Polished CV Preview
          </div>
        </Card>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold">ATS-Friendly</h3>
          <p className="mt-2 text-sm text-gray-600">Structured content and keyword optimization to pass applicant tracking systems.</p>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Beautiful Templates</h3>
          <p className="mt-2 text-sm text-gray-600">Minimalist and professional layouts that look great on any device.</p>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Export & Share</h3>
          <p className="mt-2 text-sm text-gray-600">Download as PDF/DOCX/TXT or share a public link in seconds.</p>
        </Card>
      </div>
    </section>
  );
}