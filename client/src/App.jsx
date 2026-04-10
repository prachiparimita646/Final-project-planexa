import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout  from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home        from './pages/public/Home';
import About       from './pages/public/About';
import Login       from './pages/public/Login';
import Register    from './pages/public/Register';
import ContactUs   from './pages/public/ContactUs';
import Event       from './pages/public/Event';
import EventDetail from './pages/public/EventDetail';
import MyBookings  from './pages/public/MyBookings';
import Feedback    from './pages/public/Feedback'; 
import Footer      from './pages/public/Footer';

// User Pages
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents    from './pages/admin/AdminEvents';
import AdminEvent     from './pages/admin/AdminEvent';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminContact   from './pages/admin/AdminContact';
import AdminBookings  from './pages/admin/AdminBookings';

// Route Guards
import ProtectedRoute from './route/ProtectedRoute';
import PublicRoute    from './route/PublicRoute';

function App() {
  return (
    <Routes>

      {/* ── PUBLIC ROUTES (MainLayout) ── */}
      <Route path="/" element={<MainLayout />}>
        <Route index                element={<Home />} />
        <Route path="about"         element={<About />} />
        <Route path="contact"       element={<ContactUs />} />
        <Route path="events"        element={<Event />} />
        <Route path="events/:id"    element={<EventDetail />} />
        <Route path="my-bookings"   element={<MyBookings />} />
        <Route path="feedback"      element={<Feedback />} />

        {/* Only if NOT logged in */}
        <Route path="login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Only if logged in */}
        <Route path="profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      {/* ── ADMIN ROUTES (AdminLayout) ── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="events"          element={<AdminEvents />} />
        <Route path="events/new"      element={<AdminEvent />} />
        <Route path="events/:id/edit" element={<AdminEvent />} />
        <Route path="users"           element={<AdminUsers />} />
        <Route path="contact"         element={<AdminContact />} />
        <Route path="bookings"        element={<AdminBookings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;