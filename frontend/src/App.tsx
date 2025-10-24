import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Roles from './pages/Roles';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Orders from './pages/Orders';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes without Layout */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with Layout */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/roles" element={<Layout><Roles /></Layout>} />
          <Route path="/users" element={<Layout><Users /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
