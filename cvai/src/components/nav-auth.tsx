"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SignOut } from '@/components/session-actions';

export default function NavAuth() {
  const { data } = useSession();
  if (!data?.user) {
    return <Link href="/signin" className="hover:text-brand">Sign in</Link>;
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-600">{data.user.name ?? data.user.email}</span>
      <SignOut />
    </div>
  );
}