'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, GraduationCap, Briefcase, MessageSquare, LogOut, UserPlus } from 'lucide-react';
import { logoutUser } from '@/services/authService';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/mentorship', label: 'Mentorship', icon: GraduationCap },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/network', label: 'Network', icon: UserPlus },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logoutUser();
    router.replace('/login');
  }

  return (
    <aside className="nav-sidebar">
      <div className="nav-sidebar__header">
        <Link href="/" className="nav-sidebar__brand">
          <span>UniSync</span>
        </Link>
      </div>

      <nav className="nav-sidebar__menu" aria-label="Dashboard navigation">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-sidebar__item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-sidebar__icon" aria-hidden="true">
                <item.icon size={20} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button
          onClick={handleLogout}
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
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.875rem',
            fontWeight: 500,
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
