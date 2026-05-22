'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PublicNavbar from '@/components/PublicNavbar';

export default function PublicLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('backendToken');
    if (token && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router, pathname]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--color-text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-shell">
      <PublicNavbar />
      <main className="page-frame">
        {children}
      </main>
    </div>
  );
}
