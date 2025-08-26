"use client";
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input, Label } from '@/components/inputs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
    <div className="min-h-[calc(100vh-64px-64px)] grid place-items-center bg-[radial-gradient(80%_80%_at_50%_-20%,#e0ecff,transparent)]">
      <Card className="w-full max-w-md p-6">
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
          <div className="flex gap-3">
            <Button type="submit">{isRegister ? 'Create and sign in' : 'Sign in'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsRegister(v => !v)}>
              {isRegister ? 'Have an account? Sign in' : 'New here? Create account'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}