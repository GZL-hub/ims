import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getAllInventoryItems } from '../../services/inventoryService';

interface StockChartProps {
  title: string;
}

interface StockData {
  label: string;
  value: number;
  count: number;
}

const StockChart: React.FC<StockChartProps> = ({ title }) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trend, setTrend] = useState<number>(0);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const items = await getAllInventoryItems();

        // Group items by category and calculate average stock percentage
        const categoryMap = new Map<string, { totalPercentage: number; count: number }>();

        items.forEach(item => {
          // Calculate stock percentage (quantity relative to threshold * 10 for better visualization)
          const stockPercentage = Math.min((item.quantity / (item.threshold * 10)) * 100, 100);

          if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, { totalPercentage: 0, count: 0 });
          }

          const categoryData = categoryMap.get(item.category)!;
          categoryData.totalPercentage += stockPercentage;
          categoryData.count += 1;
        });

        // Convert to array and calculate averages
        const stockData: StockData[] = Array.from(categoryMap.entries())
          .map(([category, data]) => ({
            label: category,
            value: Math.round(data.totalPercentage / data.count),
            count: data.count,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 7); // Top 7 categories

        setData(stockData);

        // Calculate trend (simplified - based on average stock level)
        const avgStockLevel = stockData.reduce((sum, d) => sum + d.value, 0) / stockData.length;
        setTrend(avgStockLevel > 70 ? 12 : avgStockLevel > 50 ? 5 : avgStockLevel > 30 ? -5 : -12);

        setError(null);
      } catch (err) {
        setError('Failed to load stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-text-600 dark:text-gray-300">Loading stock data...</div>
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

  if (data.length === 0) {
    return (
      <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-text-600 dark:text-gray-300">No inventory data available</div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-950 dark:text-white">{title}</h2>
        {trend > 0 ? (
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : trend < 0 ? (
          <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
        ) : (
          <Minus className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        )}
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-text-700 dark:text-gray-300 font-medium">{item.label}</span>
                <span className="text-text-500 dark:text-gray-400 text-xs">({item.count} items)</span>
              </div>
              <span className="text-text-950 dark:text-white font-semibold">{item.value}%</span>
            </div>
            <div className="w-full bg-background-200 dark:bg-background-300 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  item.value >= 70
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : item.value >= 40
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-background-200 dark:border-background-300">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-text-600 dark:text-gray-400 text-xs">Avg</p>
            <p className="text-text-950 dark:text-white font-bold text-lg">
              {Math.round(data.reduce((acc, d) => acc + d.value, 0) / data.length)}%
            </p>
          </div>
          <div>
            <p className="text-text-600 dark:text-gray-400 text-xs">Peak</p>
            <p className="text-text-950 dark:text-white font-bold text-lg">{maxValue}%</p>
          </div>
          <div>
            <p className="text-text-600 dark:text-gray-400 text-xs">Trend</p>
            <p className={`font-bold text-lg ${trend > 0 ? 'text-green-600 dark:text-green-400' : trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
