'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar.jsx';
import Avatar from '../common/Avatar.jsx';

function Topbar() {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(stored);
  }, []);

  return (
    <header className="nav-topbar">
      <div className="nav-topbar__search">
        <SearchBar id="dashboard-search" placeholder="Search UniSync" />
      </div>
      <div className="nav-topbar__actions">
        <button className="nav-topbar__icon-button" type="button" aria-label="Notifications">
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
