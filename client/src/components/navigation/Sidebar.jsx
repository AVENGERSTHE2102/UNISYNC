import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, GraduationCap, Briefcase, MessageSquare } from 'lucide-react';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/mentorship', label: 'Mentorship', icon: GraduationCap },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
];

function Sidebar() {
  return (
    <aside className="nav-sidebar">
      <div className="nav-sidebar__header">
        <NavLink to="/" className="nav-sidebar__brand">
          <span>UniSync</span>
        </NavLink>
      </div>

      <nav className="nav-sidebar__menu" aria-label="Dashboard navigation">
        {sidebarItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-sidebar__item">
            <span className="nav-sidebar__icon" aria-hidden="true">
              <item.icon size={20} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
