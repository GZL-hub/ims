import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Contrast, Bell, ChevronRight, LogOut } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Header: React.FC = () => {
  const { theme, toggleTheme, highContrast, toggleHighContrast } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'IMS', href: '/dashboard' }];

    if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
      breadcrumbs.push({ label: 'Dashboard' });
    } else {
      pathSegments.forEach((segment, index) => {
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        const href = index === pathSegments.length - 1 ? undefined : '/' + pathSegments.slice(0, index + 1).join('/');
        breadcrumbs.push({ label, href });
      });
    }

    return breadcrumbs;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 px-3 sm:px-6 flex items-center justify-between bg-background-50 border-b border-background-200">
      {/* Breadcrumbs */}
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-text-600 mx-1" />}
            {item.href ? (
              <Link
                to={item.href}
                className="text-text-700 hover:text-text-950 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-950">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        {/* Notifications */}
        <button
          type="button"
          className="p-2 hover:bg-background-200 rounded-lg transition-colors flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-text-700" />
        </button>

         {/* High Contrast Mode */}
        <button
          type="button"
          onClick={toggleHighContrast}
          title="Toggle high contrast"
          aria-pressed={highContrast}
          className={
            'p-2 rounded-lg transition-colors flex items-center justify-center ' +
            (highContrast ? 'bg-primary-100' : 'hover:bg-background-200')
          }
        >

          <Contrast className={'h-5 w-5 ' + (highContrast ? 'text-primary-700' : 'text-text-700')} />
        </button>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-background-200 rounded-lg transition-colors flex items-center justify-center"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-text-700" />
          ) : (
            <Sun className="h-5 w-5 text-text-700" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 hover:bg-background-200 rounded-lg transition-colors flex items-center gap-2"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-600 capitalize">{user?.role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-background-50 rounded-lg shadow-lg border border-background-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-background-200">
                <p className="text-sm font-medium text-text-900">{user?.email}</p>
                <p className="text-xs text-text-600 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-background-100 transition-colors"
              >
                Settings
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-background-200 rounded-lg transition-colors flex items-center justify-center"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-text-700" />
        </button>
      </div>
    </header>
  );
};

export default Header;
