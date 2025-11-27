import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
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
  ChevronLeft,
  ChevronRight,
  ScanBarcode,
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, children, onClick, isCollapsed: collapsed = isCollapsed }) => {
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
        } ${collapsed ? 'justify-center' : ''}`}
        title={collapsed ? children?.toString() : undefined}
      >
        <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
        {!collapsed && <span className="whitespace-nowrap">{children}</span>}
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
          fixed inset-y-0 left-0 z-[70] bg-background-50 transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static border-r border-background-200 overflow-hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Collapse Button */}
          <div className={`h-16 flex items-center justify-between border-b border-background-200 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {!isCollapsed ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0">
                  <Logo className="flex-shrink-0" size={32} />
                  <div className="min-w-0">
                    <span className="text-lg font-bold text-text-950 dark:text-white block whitespace-nowrap">i-IMS</span>
                    <span className="text-xs text-text-600 dark:text-text-400 whitespace-nowrap">Inventory System</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-md text-text-600 hover:text-text-950 hover:bg-background-200 transition-colors flex-shrink-0"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-md text-text-600 hover:text-text-950 hover:bg-background-200 transition-colors mx-auto"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              {/* Overview Section */}
              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-600 whitespace-nowrap">
                    Overview
                  </div>
                )}
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
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-600 whitespace-nowrap">
                    Management
                  </div>
                )}
                <div className="space-y-1">
                  <NavItem href="/inventory" icon={Package}>
                    Inventory
                  </NavItem>
                  <NavItem href="/barcode-scanner" icon={ScanBarcode}>
                    Barcode Scanner
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

              {/* Settings Section */}
              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-600 whitespace-nowrap">
                    Settings
                  </div>
                )}
                <div className="space-y-1">
                  <NavItem href="/settings" icon={Settings}>
                    Settings
                  </NavItem>
                  <NavItem href="/help" icon={HelpCircle}>
                    Help
                  </NavItem>
                </div>
              </div>
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
