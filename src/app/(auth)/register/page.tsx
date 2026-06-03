'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Keys do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // API call to /auth/register
      await api.post('/auth/register', { 
        email, 
        password,
        confirm_password: confirmPassword
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to provision new profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0A0A0B] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-widest">
              Profile Provisioning
            </span>
            <span className="font-mono text-[9px] text-zinc-600">
              SYS_REG_v1
            </span>
          </div>
          <CardTitle className="mt-2 text-foreground">Register Profile</CardTitle>
          <CardDescription>
            Submit details to provision a digital ledger account and wallet.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="border border-error/50 bg-error/10 p-3 text-xs text-error font-mono rounded-none uppercase tracking-wide">
                Error: {error}
              </div>
            )}
            {success && (
              <div className="border border-primary bg-primary/10 p-3 text-xs text-primary font-mono rounded-none uppercase tracking-wide">
                Profile Provisioned! Redirecting to Auth...
              </div>
            )}
            <Input
              label="Secure Identity (Email)"
              type="email"
              id="email"
              placeholder="operator@ledger.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
              required
            />
            <Input
              label="Access Key (Password)"
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
              required
            />
            <Input
              label="Confirm Access Key"
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              disabled={loading || success}
            >
              {loading ? 'Provisioning...' : 'Provision Ledger Profile'}
            </Button>
            <div className="w-full text-center mt-2">
              <span className="font-mono text-[10px] text-text-muted">
                Already registered?{' '}
                <Link
                  href="/login"
                  className="text-secondary hover:underline uppercase font-bold"
                >
                  Sign In
                </Link>
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
