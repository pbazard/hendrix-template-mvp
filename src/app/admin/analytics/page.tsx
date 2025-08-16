/**
 * Analytics Dashboard Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  QrCode,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalQRCodes: number;
    totalScans: number;
    activeUsers: number;
  };
  userGrowth: Array<{
    date: string;
    users: number;
    qrCodes: number;
  }>;
  scanActivity: Array<{
    date: string;
    scans: number;
  }>;
  topQRCodes: Array<{
    id: string;
    name: string;
    scans: number;
    created: Date;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setAnalytics({
        overview: {
          totalUsers: 1247,
          totalQRCodes: 5683,
          totalScans: 89432,
          activeUsers: 342
        },
        userGrowth: [
          { date: '2024-01-01', users: 1200, qrCodes: 5400 },
          { date: '2024-01-02', users: 1210, qrCodes: 5450 },
          { date: '2024-01-03', users: 1225, qrCodes: 5520 },
          { date: '2024-01-04', users: 1235, qrCodes: 5580 },
          { date: '2024-01-05', users: 1242, qrCodes: 5630 },
          { date: '2024-01-06', users: 1245, qrCodes: 5665 },
          { date: '2024-01-07', users: 1247, qrCodes: 5683 }
        ],
        scanActivity: [
          { date: '2024-01-01', scans: 12430 },
          { date: '2024-01-02', scans: 13200 },
          { date: '2024-01-03', scans: 11800 },
          { date: '2024-01-04', scans: 14500 },
          { date: '2024-01-05', scans: 13900 },
          { date: '2024-01-06', scans: 15200 },
          { date: '2024-01-07', scans: 12100 }
        ],
        topQRCodes: [
          { id: '1', name: 'Company Website', scans: 15420, created: new Date('2024-01-01') },
          { id: '2', name: 'Product Catalog', scans: 12340, created: new Date('2024-01-02') },
          { id: '3', name: 'Contact Info', scans: 9876, created: new Date('2024-01-03') },
          { id: '4', name: 'Social Media', scans: 8765, created: new Date('2024-01-04') },
          { id: '5', name: 'Menu QR', scans: 7654, created: new Date('2024-01-05') }
        ]
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ title, value, change, icon: Icon }: {
    title: string;
    value: number;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
          {change !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change >= 0 ? '+' : ''}{change}% vs last period
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Monitor system performance and user engagement</p>
            </div>
            <div className="flex space-x-3">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={analytics.overview.totalUsers}
                change={12.5}
                icon={Users}
              />
              <StatCard
                title="QR Codes Created"
                value={analytics.overview.totalQRCodes}
                change={8.2}
                icon={QrCode}
              />
              <StatCard
                title="Total Scans"
                value={analytics.overview.totalScans}
                change={15.7}
                icon={BarChart3}
              />
              <StatCard
                title="Active Users"
                value={analytics.overview.activeUsers}
                change={-2.1}
                icon={TrendingUp}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.userGrowth.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-gray-200 rounded-t-lg relative">
                        <div
                          className="bg-blue-500 rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${(item.users / Math.max(...analytics.userGrowth.map(d => d.users))) * 200}px`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(item.date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scan Activity Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Daily Scans</h3>
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.scanActivity.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-gray-200 rounded-t-lg relative">
                        <div
                          className="bg-green-500 rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${(item.scans / Math.max(...analytics.scanActivity.map(d => d.scans))) * 200}px`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(item.date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top QR Codes Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Performing QR Codes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QR Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Scans
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.topQRCodes.map((qr, index) => (
                      <tr key={qr.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <QrCode className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{qr.name}</div>
                              <div className="text-sm text-gray-500">ID: {qr.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatNumber(qr.scans)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {qr.created.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(qr.scans / analytics.topQRCodes[0].scans) * 100}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.round((qr.scans / analytics.topQRCodes[0].scans) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </main>
    </div>
  );
}
