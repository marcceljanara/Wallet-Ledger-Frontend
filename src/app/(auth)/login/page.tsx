'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { isAxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Save details returned from successful login (under response.data.data)
      const data = response.data?.data;
      if (!data) {
        throw new Error('Invalid response structure from server.');
      }
      
      const user = {
        user_id: data.user_id || '',
        email: data.email || email,
        role: data.role || 'USER',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
      };

      // Set Zustand store
      setUser(user);
      
      // Set LocalStorage for persistence check
      localStorage.setItem('wl_user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error(err);
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message || 
          err.response?.data?.error || 
          'Failed to authenticate. Check credentials.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
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
              Security Portal
            </span>
            <span className="font-mono text-[9px] text-zinc-600">
              SYS_AUTH_v1
            </span>
          </div>
          <CardTitle className="mt-2 text-foreground">Sign In to Ledger</CardTitle>
          <CardDescription>
            Enter credentials to establish secure terminal session.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="border border-error/50 bg-error/10 p-3 text-xs text-error font-mono rounded-none uppercase tracking-wide">
                Error: {error}
              </div>
            )}
            <Input
              label="Secure Identity (Email)"
              type="email"
              id="email"
              placeholder="operator@ledger.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              label="Security Access Key (Password)"
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Establish Connection'}
            </Button>
            <div className="w-full text-center mt-2">
              <span className="font-mono text-[10px] text-text-muted">
                No identity profile?{' '}
                <Link
                  href="/register"
                  className="text-secondary hover:underline uppercase font-bold"
                >
                  Register Profile
                </Link>
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
