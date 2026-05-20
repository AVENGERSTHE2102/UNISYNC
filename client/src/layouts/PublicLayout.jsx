import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';

function PublicLayout() {
  return (
    <div className="app-shell">
      <PublicNavbar />
      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
