import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import Providers from '@/components/providers';
import NavAuth from '@/components/nav-auth';

export const metadata: Metadata = {
  title: 'CV AI Builder',
  description: 'AI-powered CV and cover letter generator'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[radial-gradient(80%_80%_at_50%_-20%,#e0ecff,transparent)]">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b sticky top-0 bg-white/70 backdrop-blur z-10">
              <div className="container py-3 flex items-center justify-between">
                <Link href="/" className="font-semibold text-lg">CV AI</Link>
                <nav className="flex items-center gap-4 text-sm">
                  <Link href="/builder" className="hover:text-brand">Builder</Link>
                  <Link href="/documents" className="hover:text-brand">Documents</Link>
                  <NavAuth />
                </nav>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t bg-white/70 backdrop-blur">
              <div className="container py-6 text-sm text-gray-500 flex items-center justify-between">
                <span>© {new Date().getFullYear()} CV AI Builder</span>
                <span className="text-gray-400">Built with Next.js + Tailwind</span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}