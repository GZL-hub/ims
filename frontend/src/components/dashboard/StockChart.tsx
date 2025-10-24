import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StockChartProps {
  title: string;
  data?: { label: string; value: number }[];
}

const StockChart: React.FC<StockChartProps> = ({
  title,
  data = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 52 },
    { label: 'Thu', value: 85 },
    { label: 'Fri', value: 92 },
    { label: 'Sat', value: 74 },
    { label: 'Sun', value: 68 },
  ]
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-950">{title}</h2>
        <TrendingUp className="w-5 h-5 text-primary-600" />
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-700 font-medium">{item.label}</span>
              <span className="text-text-950 font-semibold">{item.value}%</span>
            </div>
            <div className="w-full bg-background-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-background-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-text-600 text-xs">Avg</p>
            <p className="text-text-950 font-bold text-lg">
              {Math.round(data.reduce((acc, d) => acc + d.value, 0) / data.length)}%
            </p>
          </div>
          <div>
            <p className="text-text-600 text-xs">Peak</p>
            <p className="text-text-950 font-bold text-lg">{maxValue}%</p>
          </div>
          <div>
            <p className="text-text-600 text-xs">Trend</p>
            <p className="text-green-600 font-bold text-lg">+12%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
