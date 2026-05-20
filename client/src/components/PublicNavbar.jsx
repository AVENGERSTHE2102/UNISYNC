import { NavLink } from 'react-router-dom';
import Button from './common/Button.jsx';

const navItems = [
  { to: '/about', label: 'About' }
];

function PublicNavbar() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand">
        <span>UniSync</span>
      </NavLink>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="auth-actions">
        <NavLink to="/login">
          <Button variant="ghost">Login</Button>
        </NavLink>
        <NavLink to="/signup">
          <Button variant="primary">Sign Up</Button>
        </NavLink>
      </div>
    </header>
  );
}

export default PublicNavbar;
