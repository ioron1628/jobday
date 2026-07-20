"use client";

import React, { useEffect, useState } from 'react';
import type { SeoAnalytics } from "@/types/autobot";

const AutobotSeoAnalytics: React.FC = () => {
  const [seoData, setSeoData] = useState<SeoAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/autobot/seo');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SeoAnalytics[] = await response.json();
        setSeoData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading SEO analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">SEO Analytics</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Keyword</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Impressions</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Clicks</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">CTR</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Avg. Position</th>
            </tr>
          </thead>
          <tbody>
            {seoData.map((dataItem) => (
              <tr key={dataItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{new Date(dataItem.date).toLocaleDateString()}</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{dataItem.keyword || 'N/A'}</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{dataItem.impressions || 0}</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{dataItem.clicks || 0}</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{(dataItem.ctr || 0).toFixed(2)}%</td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white">{(dataItem.avg_position || 0).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {seoData.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No SEO analytics data found.
        </div>
      )}
    </div>
  );
};

export default AutobotSeoAnalytics;
