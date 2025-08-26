"use client";
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input, Label } from '@/components/inputs';

export default function SignInPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isRegister) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        setError('Registration failed');
        return;
      }
    }
    const resp = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/builder' });
    if (resp?.error) setError(resp.error);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold">{isRegister ? 'Create account' : 'Sign in'}</h1>
      <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
        {isRegister && (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="px-4 py-2 rounded-md bg-brand text-white" type="submit">{isRegister ? 'Create and sign in' : 'Sign in'}</button>
      </form>
      <button className="mt-3 text-sm text-brand" onClick={() => setIsRegister(v => !v)}>
        {isRegister ? 'Have an account? Sign in' : "New here? Create an account"}
      </button>
    </div>
  );
}