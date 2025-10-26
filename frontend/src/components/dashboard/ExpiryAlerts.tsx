import React from 'react';
import { AlertTriangle, AlertCircle, TrendingDown } from 'lucide-react';

interface Alert {
  id: number;
  itemName: string;
  sku: string;
  quantity: number;
  expiryDate: string;
  daysLeft: number;
  severity: 'critical' | 'warning' | 'low-stock';
}

const ExpiryAlerts: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: 1,
      itemName: 'Medical Supplies Kit A',
      sku: 'MED-001',
      quantity: 45,
      expiryDate: '2025-11-02',
      daysLeft: 8,
      severity: 'critical',
    },
    {
      id: 2,
      itemName: 'Office Paper Reams',
      sku: 'OFF-234',
      quantity: 12,
      expiryDate: '2025-11-15',
      daysLeft: 21,
      severity: 'warning',
    },
    {
      id: 3,
      itemName: 'Safety Equipment Set',
      sku: 'SAF-789',
      quantity: 5,
      expiryDate: '-',
      daysLeft: 0,
      severity: 'low-stock',
    },
    {
      id: 4,
      itemName: 'Cleaning Supplies',
      sku: 'CLN-456',
      quantity: 23,
      expiryDate: '2025-11-20',
      daysLeft: 26,
      severity: 'warning',
    },
  ];

  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-300',
          badge: 'bg-red-500',
          icon: <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-700" />,
          text: 'text-red-700 dark:text-white',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-700 border-yellow-200 dark:border-yellow-400',
          badge: 'bg-yellow-500',
          icon: <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-700" />,
          text: 'text-yellow-700 dark:text-white',
        };
      case 'low-stock':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-700 border-yellow-200 dark:border-yellow-300',
          badge: 'bg-yellow-500',
          icon: <TrendingDown className="w-4 h-4 text-yellow-600 dark:text-yellow-700" />,
          text: 'text-yellow-700 dark:text-white',
        };
    }
  };

  const getSeverityLabel = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'Expires Soon';
      case 'warning':
        return 'Expiring';
      case 'low-stock':
        return 'Low Stock';
    }
  };

  return (
    <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-700" />
          <h2 className="text-xl font-semibold text-text-950">Stock & Expiry Alerts</h2>
        </div>
        <span className="px-3 py-1 bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-800 text-sm font-semibold rounded-full">
          {alerts.length} Alerts
        </span>
      </div>

      <div className="space-y-3 max-h-[450px] overflow-y-auto">
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          return (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${styles.bg} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full ${styles.badge} flex items-center justify-center text-white flex-shrink-0`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-text-950 font-semibold text-sm">{alert.itemName}</h3>
                      <span className={`px-2 py-0.5 ${styles.badge} text-white text-xs rounded-full font-medium`}>
                        {getSeverityLabel(alert.severity)}
                      </span>
                    </div>
                    <p className="text-text-600 dark:text-text-700 text-xs mb-2">SKU: {alert.sku}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-text-500 dark:text-text-600">Quantity:</span>
                        <span className={`ml-1 font-semibold ${alert.quantity < 10 ? 'text-red-600 dark:text-red-700' : 'text-text-700 dark:text-text-800'}`}>
                          {alert.quantity} units
                        </span>
                      </div>
                      {alert.severity !== 'low-stock' && (
                        <>
                          <div>
                            <span className="text-text-500 dark:text-text-600">Expires:</span>
                            <span className="ml-1 font-semibold text-text-700 dark:text-text-800">{alert.expiryDate}</span>
                          </div>
                          <div>
                            <span className={`font-semibold ${styles.text}`}>
                              {alert.daysLeft} days left
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="text-primary-600 dark:text-primary-700 hover:text-primary-700 dark:hover:text-primary-800 text-xs font-medium flex-shrink-0">
                  Action
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-background-200 dark:border-background-500">
        <button className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-300 text-white font-medium rounded-lg transition-colors text-sm">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default ExpiryAlerts;
