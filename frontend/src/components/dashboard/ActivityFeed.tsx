import React from 'react';
import { User, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  type: 'user' | 'inventory' | 'alert' | 'success';
  role?: string;
}

const ActivityFeed: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      user: 'Sarah Chen',
      action: 'Updated stock levels for "Medical Supplies"',
      time: '5 mins ago',
      type: 'inventory',
      role: 'Manager',
    },
    {
      id: 2,
      user: 'John Doe',
      action: 'Approved order #12453',
      time: '12 mins ago',
      type: 'success',
      role: 'Admin',
    },
    {
      id: 3,
      user: 'System',
      action: 'Low stock alert for "Item ABC-123"',
      time: '25 mins ago',
      type: 'alert',
    },
    {
      id: 4,
      user: 'Maria Garcia',
      action: 'Added new user "Alex Thompson" with Viewer role',
      time: '1 hour ago',
      type: 'user',
      role: 'Admin',
    },
    {
      id: 5,
      user: 'System',
      action: 'Automated inventory sync completed',
      time: '2 hours ago',
      type: 'success',
    },
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />;
      case 'inventory':
        return <Package className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getIconBgColor = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500';
      case 'inventory':
        return 'bg-primary-500';
      case 'alert':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-text-500';
    }
  };

  return (
    <div className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-950">Recent Activity</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-background-100 rounded-lg hover:bg-background-200 transition-colors duration-200 group"
          >
            <div className={`w-10 h-10 rounded-full ${getIconBgColor(activity.type)} flex items-center justify-center text-white flex-shrink-0`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-text-950 font-medium truncate">{activity.user}</p>
                {activity.role && (
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                    {activity.role}
                  </span>
                )}
              </div>
              <p className="text-text-700 text-sm">{activity.action}</p>
              <p className="text-text-500 text-xs mt-1">{activity.time}</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-text-700 hover:text-primary-600 transition-all text-sm font-medium flex-shrink-0">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
