import React from 'react';
import StockChart from '../components/dashboard/StockChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import OrderLog from '../components/dashboard/OrderLog';
import ExpiryAlerts from '../components/dashboard/ExpiryAlerts';

const Dashboard: React.FC = () => {

  return (
    <div className="space-y-6">
      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart title="Inventory Capacity (Last 7 Days)" />
        <ExpiryAlerts />
      </div>

      {/* Order Log */}
      <OrderLog />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
};

export default Dashboard;
