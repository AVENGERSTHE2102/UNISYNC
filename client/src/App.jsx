import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Community from './pages/Community.jsx';
import Mentorship from './pages/Mentorship.jsx';
import Jobs from './pages/Jobs.jsx';
import Chat from './pages/Chat.jsx';
import Events from './pages/Events.jsx';
import Profile from './pages/Profile.jsx';
import About from './pages/About.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="about" element={<About />} />
        <Route path="about.html" element={<About />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Legacy paths matching the old static HTML frontend. */}
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="login.html" element={<Login />} />
          <Route path="signup.html" element={<Signup />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="community" element={<Community />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="chat" element={<Chat />} />
          <Route path="events" element={<Events />} />
          <Route path="profile" element={<Profile />} />

          {/* Legacy dashboard paths from the old static HTML frontend. */}
          <Route path="dashboard.html" element={<Dashboard />} />
          <Route path="community.html" element={<Community />} />
          <Route path="mentorship.html" element={<Mentorship />} />
          <Route path="jobs.html" element={<Jobs />} />
          <Route path="chat.html" element={<Chat />} />
          <Route path="events.html" element={<Events />} />
          <Route path="profile.html" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
