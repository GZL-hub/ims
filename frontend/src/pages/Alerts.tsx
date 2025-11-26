import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlerts, type AlertItem, type AlertStats } from '../services/alertsService';
import { AlertTriangle, Package, TrendingDown, Calendar, Edit, PackageX } from 'lucide-react';
import AlertsNavbar from '../components/alerts/AlertsNavbar';

const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    critical: 0,
    warning: 0,
    lowStock: 0,
    outOfStock: 0,
    expired: 0,
    expiringSoon: 0,
    expiring: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'low-stock' | 'out-of-stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        setAlerts(data.alerts);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Get unique categories from alerts
  const categories = useMemo(() => {
    const uniqueCategories = new Set(alerts.map(alert => alert.category));
    return Array.from(uniqueCategories).sort();
  }, [alerts]);

  // Filter alerts based on severity, search query, and category
  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    // Apply severity filter
    if (filter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.item_name.toLowerCase().includes(query) ||
        alert.barcode?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(alert => alert.category === selectedCategory);
    }

    return filtered;
  }, [alerts, filter, searchQuery, selectedCategory]);

  const getSeverityStyles = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          iconColor: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-500 dark:bg-red-600 text-white',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-500 dark:bg-yellow-600 text-white',
        };
      case 'low-stock':
        return {
          iconColor: 'text-orange-600 dark:text-orange-400',
          badge: 'bg-orange-500 dark:bg-orange-600 text-white',
        };
      case 'out-of-stock':
        return {
          iconColor: 'text-gray-600 dark:text-gray-400',
          badge: 'bg-gray-500 dark:bg-gray-600 text-white',
        };
    }
  };

  const getSeverityIcon = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <Calendar className="w-5 h-5" />;
      case 'low-stock':
        return <TrendingDown className="w-5 h-5" />;
      case 'out-of-stock':
        return <PackageX className="w-5 h-5" />;
    }
  };

  const getAlertTypeLabel = (alertType: AlertItem['alertType']) => {
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

  const handleEditItem = (item: AlertItem) => {
    // Navigate to inventory page with edit modal opened
    navigate('/inventory', { state: { editItem: item } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-600 dark:text-text-400">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts Navbar with Filters and Search */}
      <AlertsNavbar
        stats={stats}
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-text-400 dark:text-text-500 mx-auto mb-3" />
          <p className="text-text-600 dark:text-text-400 text-lg font-medium">No alerts found</p>
          <p className="text-text-500 dark:text-text-500 text-sm mt-1">
            {searchQuery || selectedCategory
              ? "No alerts match your search or filter criteria."
              : filter === 'all'
                ? "All inventory items are in good condition!"
                : `No ${filter} alerts at this time.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert._id}
                className="bg-white dark:bg-background-50 border border-background-200 dark:border-background-300 rounded-lg p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`${styles.iconColor} mt-1`}>
                      {getSeverityIcon(alert.severity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-text-950 dark:text-white font-semibold text-base">
                          {alert.item_name}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                          {getAlertTypeLabel(alert.alertType)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 flex-wrap text-sm">
                        <span className="text-text-600 dark:text-text-300">
                          Category: <span className="font-medium text-text-900 dark:text-white">{alert.category}</span>
                        </span>
                        {alert.barcode && (
                          <>
                            <span className="text-text-400">•</span>
                            <span className="text-text-600 dark:text-text-300">
                              Barcode: <span className="font-mono font-medium text-text-900 dark:text-white">{alert.barcode}</span>
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm flex-wrap">
                        <div>
                          <span className="text-text-500 dark:text-text-400">Quantity: </span>
                          <span className={`font-semibold ${
                            alert.quantity === 0
                              ? 'text-gray-600 dark:text-gray-400'
                              : alert.quantity <= alert.threshold
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-text-900 dark:text-white'
                          }`}>
                            {alert.quantity} units
                          </span>
                          <span className="text-text-500 dark:text-text-400 ml-1">
                            (Threshold: {alert.threshold})
                          </span>
                        </div>

                        {alert.expiry_date && (
                          <>
                            <div>
                              <span className="text-text-500 dark:text-text-400">Expires: </span>
                              <span className="font-semibold text-text-900 dark:text-white">
                                {new Date(alert.expiry_date).toLocaleDateString()}
                              </span>
                            </div>
                            {alert.alertType !== 'low-stock' && alert.alertType !== 'out-of-stock' && (
                              <div>
                                <span className={`font-semibold ${
                                  alert.daysLeft < 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : alert.daysLeft <= 7
                                      ? 'text-red-600 dark:text-red-400'
                                      : 'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                  {alert.daysLeft < 0
                                    ? `Expired ${Math.abs(alert.daysLeft)} days ago`
                                    : `${alert.daysLeft} day${alert.daysLeft !== 1 ? 's' : ''} left`}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditItem(alert)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors flex-shrink-0"
                    title="Edit item"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
