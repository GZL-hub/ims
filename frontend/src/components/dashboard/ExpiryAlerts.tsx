import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, TrendingDown, XCircle } from 'lucide-react';
import { getInventoryAlerts, type InventoryAlert } from '../../services/inventoryService';

const ExpiryAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await getInventoryAlerts();
        setAlerts(data.alerts);
        setError(null);
      } catch (err) {
        setError('Failed to load alerts');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getSeverityStyles = (severity: InventoryAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
          badge: 'bg-red-500 dark:bg-red-600',
          icon: <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-100" />,
          text: 'text-red-700 dark:text-red-200',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-700 border-yellow-200 dark:border-yellow-700',
          badge: 'bg-yellow-500 dark:bg-yellow-600',
          icon: <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-100" />,
          text: 'text-yellow-700 dark:text-yellow-200',
        };
      case 'low-stock':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-700 border-yellow-200 dark:border-yellow-700',
          badge: 'bg-yellow-500 dark:bg-yellow-600',
          icon: <TrendingDown className="w-4 h-4 text-yellow-600 dark:text-yellow-100" />,
          text: 'text-yellow-700 dark:text-yellow-200',
        };
      case 'out-of-stock':
        return {
          bg: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
          badge: 'bg-red-600 dark:bg-red-700',
          icon: <XCircle className="w-4 h-4 text-red-600 dark:text-red-100" />,
          text: 'text-red-700 dark:text-red-200',
        };
    }
  };

  const getSeverityLabel = (alertType: InventoryAlert['alertType']) => {
    switch (alertType) {
      case 'expired':
        return 'Expired';
      case 'expiring-soon':
        return 'Expires Soon';
      case 'expiring':
        return 'Expiring';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
    }
  };

  const formatExpiryDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-text-600 dark:text-gray-300">Loading alerts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-semibold text-text-950 dark:text-white">Stock & Expiry Alerts</h2>
        </div>
        <span className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-white text-sm font-semibold rounded-full">
          {alerts.length} Alerts
        </span>
      </div>

      <div className="space-y-3 max-h-[450px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-text-600 dark:text-gray-300">
            No alerts at this time
          </div>
        ) : (
          alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert._id}
                className={`border rounded-lg p-4 ${styles.bg} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full ${styles.badge} flex items-center justify-center text-white flex-shrink-0`}>
                      {styles.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-text-950 dark:text-white font-semibold text-sm">{alert.item_name}</h3>
                        <span className={`px-2 py-0.5 ${styles.badge} text-white text-xs rounded-full font-medium`}>
                          {getSeverityLabel(alert.alertType)}
                        </span>
                      </div>
                      <p className="text-text-600 dark:text-gray-300 text-xs mb-2">Barcode: {alert.barcode}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-text-500 dark:text-gray-300">Quantity:</span>
                          <span className={`ml-1 font-semibold ${alert.quantity < 10 ? 'text-red-600 dark:text-red-300' : 'text-text-700 dark:text-white'}`}>
                            {alert.quantity} units
                          </span>
                        </div>
                        {alert.alertType !== 'low-stock' && alert.alertType !== 'out-of-stock' && (
                          <>
                            <div>
                              <span className="text-text-500 dark:text-gray-300">Expires:</span>
                              <span className="ml-1 font-semibold text-text-700 dark:text-white">{formatExpiryDate(alert.expiry_date)}</span>
                            </div>
                            <div>
                              <span className={`font-semibold ${styles.text}`}>
                                {alert.daysLeft > 0 ? `${alert.daysLeft} days left` : 'Expired'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-background-200 dark:border-background-300">
        <button className="w-full py-2 px-4 bg-primary-900 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 text-white dark:text-black font-medium rounded-lg transition-colors text-sm">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default ExpiryAlerts;
