import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { getAllOrders, type Order } from '../../services/orderService';

const OrderLog: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        // Get the 5 most recent orders
        setOrders(data.slice(0, 5));
        setError(null);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    const statusMap = {
      'Pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: <Clock className="w-3 h-3" />,
      },
      'Completed': {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      'Cancelled': {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const style = statusMap[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-text-600 dark:text-gray-300">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm">
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
          <ShoppingCart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-text-950 dark:text-white">Order Log</h2>
        </div>
        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors">
          View All Orders
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-background-200 dark:border-background-300">
              <th className="text-left py-3 px-2 text-text-700 dark:text-gray-300 font-semibold text-sm">Order ID</th>
              <th className="text-left py-3 px-2 text-text-700 dark:text-gray-300 font-semibold text-sm">Customer</th>
              <th className="text-left py-3 px-2 text-text-700 dark:text-gray-300 font-semibold text-sm">Items</th>
              <th className="text-left py-3 px-2 text-text-700 dark:text-gray-300 font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-2 text-text-700 dark:text-gray-300 font-semibold text-sm">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-text-600 dark:text-gray-300">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-background-100 dark:border-background-200 hover:bg-background-100 dark:hover:bg-background-200 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-2">
                    <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">{order._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-text-950 dark:text-white font-medium text-sm">{order.customer_name}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-text-700 dark:text-gray-300 text-sm">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </td>
                  <td className="py-3 px-2">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-text-600 dark:text-gray-400 text-xs">{getTimeAgo(order.date_created)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderLog;
