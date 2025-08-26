"use client";
import { signOut } from 'next-auth/react';

export function SignOut() {
  return (
    <button className="text-sm text-red-600" onClick={() => signOut({ callbackUrl: '/' })}>
      Sign out
    </button>
  );
}