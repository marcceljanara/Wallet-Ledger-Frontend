'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0A0A0B] text-foreground font-mono text-xs">
      <span className="animate-pulse uppercase tracking-wider">Redirecting to Dashboard...</span>
    </div>
  );
}
