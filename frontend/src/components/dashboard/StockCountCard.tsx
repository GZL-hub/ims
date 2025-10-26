import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StockCountCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
}

const StockCountCard: React.FC<StockCountCardProps> = ({
  label,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  trend = 'up',
}) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-text-600',
  }[changeType];

  const trendIcon = {
    up: '↗',
    down: '↘',
    stable: '→',
  }[trend];

  return (
    <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary-400">
      <div className="flex items-center justify-between">
        <Icon className="w-8 h-8 text-primary-600 dark:text-primary-700" />
        <span className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}>
          <span className="text-lg">{trendIcon}</span>
          {change}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-text-600 dark:text-text-700 text-sm font-medium">{label}</p>
        <p className="text-text-950 text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StockCountCard;
