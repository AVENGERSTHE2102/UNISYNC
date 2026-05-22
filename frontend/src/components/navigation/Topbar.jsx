'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar.jsx';
import Avatar from '../common/Avatar.jsx';

function Topbar({ onMenuToggle, isMenuOpen }) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(stored);
  }, []);

  return (
    <header className="nav-topbar">
      {/* Hamburger — only renders visibly on <1024px via CSS */}
      <button
        type="button"
        className="nav-topbar__hamburger"
        onClick={onMenuToggle}
        aria-label="Open navigation"
        aria-expanded={isMenuOpen}
        aria-controls="main-sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Search — hidden on mobile via CSS, visible on tablet+ */}
      <div className="nav-topbar__search">
        <SearchBar id="dashboard-search" placeholder="Search UniSync" />
      </div>

      <div className="nav-topbar__actions">
        <button
          type="button"
          className="nav-topbar__icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <Link href="/profile" className="nav-topbar__profile-link" aria-label="Open profile">
          <Avatar name={userName} size="md" tone="teal" />
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
