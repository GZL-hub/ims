import React from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  items: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  amount: string;
  date: string;
}

const OrderLog: React.FC = () => {
  const orders: Order[] = [
    {
      id: 'ORD-1234',
      customer: 'Acme Corp',
      items: 24,
      status: 'completed',
      amount: '$2,450',
      date: '2 mins ago',
    },
    {
      id: 'ORD-1235',
      customer: 'TechStart Inc',
      items: 12,
      status: 'processing',
      amount: '$1,120',
      date: '15 mins ago',
    },
    {
      id: 'ORD-1236',
      customer: 'Global Solutions',
      items: 35,
      status: 'pending',
      amount: '$3,890',
      date: '1 hour ago',
    },
    {
      id: 'ORD-1237',
      customer: 'Metro Supplies',
      items: 8,
      status: 'completed',
      amount: '$780',
      date: '2 hours ago',
    },
    {
      id: 'ORD-1238',
      customer: 'City Hospital',
      items: 45,
      status: 'processing',
      amount: '$5,670',
      date: '3 hours ago',
    },
  ];

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: <Clock className="w-3 h-3" />,
      },
      processing: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: <Package className="w-3 h-3" />,
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const style = styles[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-text-950">Order Log</h2>
        </div>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
          View All Orders
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-background-200">
              <th className="text-left py-3 px-2 text-text-700 font-semibold text-sm">Order ID</th>
              <th className="text-left py-3 px-2 text-text-700 font-semibold text-sm">Customer</th>
              <th className="text-left py-3 px-2 text-text-700 font-semibold text-sm">Items</th>
              <th className="text-left py-3 px-2 text-text-700 font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-2 text-text-700 font-semibold text-sm">Amount</th>
              <th className="text-left py-3 px-2 text-text-700 font-semibold text-sm">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-background-100 hover:bg-background-100 transition-colors cursor-pointer"
              >
                <td className="py-3 px-2">
                  <span className="text-primary-600 font-medium text-sm">{order.id}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-text-950 font-medium text-sm">{order.customer}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-text-700 text-sm">{order.items}</span>
                </td>
                <td className="py-3 px-2">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-3 px-2">
                  <span className="text-text-950 font-semibold text-sm">{order.amount}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-text-600 text-xs">{order.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderLog;
