import React from 'react';
import ExpiryAlerts from '../components/dashboard/ExpiryAlerts';
import { AlertTriangle, Bell, Settings } from 'lucide-react';

const Alerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-950">Alerts & Notifications</h1>
          <p className="text-text-600 mt-1">Manage automated stock and expiry alerts</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Alert Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Critical</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">4</p>
          <p className="text-red-600 text-sm mt-1">Require immediate action</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Warning</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-700">8</p>
          <p className="text-yellow-600 text-sm mt-1">Need attention soon</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">Low Stock</h3>
          </div>
          <p className="text-3xl font-bold text-orange-700">12</p>
          <p className="text-orange-600 text-sm mt-1">Reorder recommended</p>
        </div>
      </div>

      <ExpiryAlerts />
    </div>
  );
};

export default Alerts;
