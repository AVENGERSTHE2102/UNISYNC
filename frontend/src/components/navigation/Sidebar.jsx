'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, GraduationCap, Briefcase, MessageSquare, LogOut, UserPlus, X } from 'lucide-react';
import { logoutUser } from '@/services/authService';
import { useEffect, useRef, useState } from 'react';
import { getChatRooms } from '@/services/dbService';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/events',    label: 'Events',     icon: Calendar },
  { href: '/community', label: 'Community',  icon: Users },
  { href: '/mentorship',label: 'Mentorship', icon: GraduationCap },
  { href: '/jobs',      label: 'Jobs',       icon: Briefcase },
  { href: '/chat',      label: 'Chat',       icon: MessageSquare },
  { href: '/network',   label: 'Network',    icon: UserPlus },
];

function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();
  const firstLinkRef = useRef(null);
  const [totalUnread, setTotalUnread] = useState(0);

  // Poll for unread messages occasionally and on mount
  useEffect(() => {
    if (!isOpen) return; // Optional: fetch when sidebar opens, but maybe better to always fetch
    let mounted = true;
    
    const fetchUnread = async () => {
      try {
        const rooms = await getChatRooms();
        if (!mounted) return;
        const unread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);
        setTotalUnread(unread);
      } catch (err) {
        // ignore auth errors if not logged in
      }
    };

    fetchUnread();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pathname, isOpen]);

  function handleLogout() {
    logoutUser();
    router.replace('/login');
  }

  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus the first link when drawer opens (focus trap entry)
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isOpen]);

  // Close drawer when a nav link is clicked (mobile UX)
  function handleLinkClick() {
    onClose();
  }

  return (
    <aside
      className={`nav-sidebar${isOpen ? ' open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-sidebar__header">
        <Link href="/" className="nav-sidebar__brand" onClick={handleLinkClick}>
          <span>UniSync</span>
        </Link>

        {/* Close button — visible on mobile/tablet only via CSS */}
        <button
          type="button"
          className="nav-sidebar__close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="nav-sidebar__menu" aria-label="Dashboard navigation">
        {sidebarItems.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-sidebar__item${isActive ? ' active' : ''}`}
              onClick={handleLinkClick}
              ref={idx === 0 ? firstLinkRef : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="nav-sidebar__icon" aria-hidden="true" style={{ position: 'relative' }}>
                <item.icon size={20} />
                {item.href === '/chat' && totalUnread > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px',
                    backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid var(--color-surface)'
                  }} />
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button
          type="button"
          onClick={() => { handleLogout(); onClose(); }}
          className="nav-sidebar__item"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.9rem',
            fontWeight: 500,
            minHeight: '48px',
          }}
          aria-label="Logout"
        >
          <span className="nav-sidebar__icon" aria-hidden="true">
            <LogOut size={20} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
