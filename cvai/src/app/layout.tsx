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
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b sticky top-0 bg-white/70 backdrop-blur z-10">
              <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
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
            <footer className="border-t">
              <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
                © {new Date().getFullYear()} CV AI Builder
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}