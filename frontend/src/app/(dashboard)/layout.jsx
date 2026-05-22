'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/navigation/Sidebar';
import Topbar from '@/components/navigation/Topbar';

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [loading,  setLoading]  = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('backendToken');
    if (!token) {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  // Close drawer whenever the route changes (mobile navigation)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const openMenu  = useCallback(() => setMenuOpen(true),  []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', color: 'var(--color-text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Overlay — tapping it closes the drawer (mobile/tablet) */}
      <div
        className={`nav-sidebar-overlay${menuOpen ? ' active' : ''}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <Sidebar
        id="main-sidebar"
        isOpen={menuOpen}
        onClose={closeMenu}
      />

      <div className="dashboard-layout__main">
        <Topbar onMenuToggle={toggleMenu} isMenuOpen={menuOpen} />
        <main className="dashboard-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}
