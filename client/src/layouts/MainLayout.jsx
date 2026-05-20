import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';

function MainLayout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
