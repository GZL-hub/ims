import React from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

const Reports: React.FC = () => {
  const reports = [
    {
      id: 1,
      title: 'Monthly Inventory Report',
      description: 'Complete inventory status and trends',
      date: 'October 2025',
      type: 'Inventory',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Stock Movement Analysis',
      description: 'Analysis of stock inflow and outflow',
      date: 'October 2025',
      type: 'Analytics',
      icon: TrendingUp,
    },
    {
      id: 3,
      title: 'User Activity Report',
      description: 'User access and activity logs',
      date: 'October 2025',
      type: 'RBAC',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-950">Reports & Analytics</h1>
          <p className="text-text-600 mt-1">Generate and download detailed reports</p>
        </div>
        <button className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black font-medium rounded-lg transition-colors flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-background-50 border border-background-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="px-2 py-1 bg-background-200 text-text-700 text-xs rounded-full font-medium">
                  {report.type}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-950 mb-2">{report.title}</h3>
              <p className="text-text-600 text-sm mb-4">{report.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-background-200">
                <span className="text-text-500 text-xs">{report.date}</span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
