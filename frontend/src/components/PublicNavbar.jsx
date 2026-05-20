'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from './common/Button.jsx';

const navItems = [
  { href: '/about', label: 'About' }
];

function PublicNavbar() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span>UniSync</span>
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="auth-actions">
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/signup">
          <Button variant="primary">Sign Up</Button>
        </Link>
      </div>
    </header>
  );
}

export default PublicNavbar;
