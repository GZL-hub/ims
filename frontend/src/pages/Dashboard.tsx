import React from 'react';
import { Package, Users, Shield, ClipboardList } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Items', value: '1,234', icon: Package, change: '+12%' },
    { label: 'Active Users', value: '89', icon: Users, change: '+5%' },
    { label: 'Roles', value: '24', icon: Shield, change: '+2' },
    { label: 'Pending Orders', value: '45', icon: ClipboardList, change: '-3%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-8 h-8 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">{stat.change}</span>
              </div>
              <div className="mt-4">
                <p className="text-text-600 text-sm">{stat.label}</p>
                <p className="text-text-950 text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text-950 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-3 bg-background-100 rounded-lg hover:bg-background-200 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  U{item}
                </div>
                <div>
                  <p className="text-text-950 font-medium">User {item} performed an action</p>
                  <p className="text-text-600 text-sm">2 hours ago</p>
                </div>
              </div>
              <button className="text-text-700 hover:text-primary-600 transition-colors">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
