import React, { useEffect, useState } from 'react';
import { Revenue } from '../../types/autobot'; // Adjust path as needed

const AutobotRevenue: React.FC = () => {
  const [revenueData, setRevenueData] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/autobot/analytics/revenue');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Revenue[] = await response.json();
        setRevenueData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading revenue data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Revenue Tracking</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Source</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((dataItem) => (
              <tr key={dataItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{new Date(dataItem.date).toLocaleDateString()}</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{dataItem.source}</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">${dataItem.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {revenueData.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No revenue data found.
        </div>
      )}
    </div>
  );
};

export default AutobotRevenue;
