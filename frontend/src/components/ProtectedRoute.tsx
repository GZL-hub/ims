import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
}) => {
  const { isAuthenticated, hasPermission, hasRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50 dark:bg-background-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-text-600 dark:text-text-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50 dark:bg-background-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-900 dark:text-text-50">403</h1>
          <p className="mt-2 text-text-600 dark:text-text-400">
            Access Denied. You don't have permission to view this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check for required role
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50 dark:bg-background-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-900 dark:text-text-50">403</h1>
          <p className="mt-2 text-text-600 dark:text-text-400">
            Access Denied. This page requires {requiredRole} role.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
