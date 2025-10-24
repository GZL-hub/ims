import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import JapaneseLogo from '../components/JapaneseLogo';
import {
  LayoutDashboard,
  Shield,
  Package,
  Users,
  Settings,
  HelpCircle,
  Menu,
  BarChart2,
  AlertTriangle,
  ShoppingCart,
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, children, onClick }) => {
    const isActive = location.pathname === href;

    return (
      <Link
        to={href}
        onClick={() => {
          onClick?.();
          handleNavigation();
        }}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? 'text-text-950 bg-primary-100'
            : 'text-text-700 hover:text-text-950 hover:bg-background-200'
        }`}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-background-50 shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-text-700" />
      </button>

      {/* Sidebar */}
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-background-50 transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:w-64 border-r border-background-200
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center border-b border-background-200">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <JapaneseLogo className="text-primary-600" size={32} />
              <div>
                <span className="text-lg font-bold text-text-950 block">i-IMS</span>
                <span className="text-xs text-text-600">Inventory System</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              {/* Overview Section */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-600">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/reports" icon={BarChart2}>
                    Reports & Analytics
                  </NavItem>
                  <NavItem href="/alerts" icon={AlertTriangle}>
                    Alerts
                  </NavItem>
                </div>
              </div>

              {/* Management Section */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-600">
                  Management
                </div>
                <div className="space-y-1">
                  <NavItem href="/inventory" icon={Package}>
                    Inventory
                  </NavItem>
                  <NavItem href="/orders" icon={ShoppingCart}>
                    Orders
                  </NavItem>
                  <NavItem href="/users" icon={Users}>
                    Users
                  </NavItem>
                  <NavItem href="/roles" icon={Shield}>
                    Roles & Access
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-background-200">
            <div className="space-y-1">
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
