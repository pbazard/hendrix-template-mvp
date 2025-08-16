/**
 * QR Codes Management Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Download,
  Share2,
  BarChart3,
  Calendar
} from 'lucide-react';

interface QRCodeData {
  id: string;
  name: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
  content: string;
  design: {
    style: string;
    color: string;
    backgroundColor: string;
  };
  stats: {
    scans: number;
    lastScan: Date | null;
  };
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  createdBy: string;
}

export default function QRCodesPage() {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading QR codes
    const timer = setTimeout(() => {
      setQRCodes([
        {
          id: '1',
          name: 'Company Website',
          type: 'url',
          content: 'https://qrartistry.com',
          design: {
            style: 'classic',
            color: '#000000',
            backgroundColor: '#FFFFFF'
          },
          stats: {
            scans: 15420,
            lastScan: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
          },
          status: 'active',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          createdBy: 'admin'
        },
        {
          id: '2',
          name: 'Product Catalog',
          type: 'url',
          content: 'https://qrartistry.com/catalog',
          design: {
            style: 'artistic',
            color: '#2563eb',
            backgroundColor: '#f0f9ff'
          },
          stats: {
            scans: 12340,
            lastScan: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
          },
          status: 'active',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
          createdBy: 'johndoe'
        },
        {
          id: '3',
          name: 'Contact Information',
          type: 'vcard',
          content: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:QRArtistry\nTEL:+1234567890\nEMAIL:john@qrartistry.com\nEND:VCARD',
          design: {
            style: 'modern',
            color: '#059669',
            backgroundColor: '#ecfdf5'
          },
          stats: {
            scans: 9876,
            lastScan: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
          },
          status: 'active',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          createdBy: 'janesmith'
        },
        {
          id: '4',
          name: 'WiFi Access',
          type: 'wifi',
          content: 'WIFI:T:WPA;S:QRArtistry-Guest;P:password123;H:false;;',
          design: {
            style: 'minimal',
            color: '#7c3aed',
            backgroundColor: '#faf5ff'
          },
          stats: {
            scans: 8765,
            lastScan: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
          },
          status: 'active',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          createdBy: 'admin'
        },
        {
          id: '5',
          name: 'Old Promotion',
          type: 'text',
          content: 'Get 50% off your first order with code SAVE50',
          design: {
            style: 'classic',
            color: '#dc2626',
            backgroundColor: '#fef2f2'
          },
          stats: {
            scans: 2341,
            lastScan: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
          },
          status: 'expired',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
          createdBy: 'admin'
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || qr.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || qr.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      url: 'bg-blue-100 text-blue-800',
      text: 'bg-gray-100 text-gray-800',
      email: 'bg-purple-100 text-purple-800',
      phone: 'bg-orange-100 text-orange-800',
      wifi: 'bg-green-100 text-green-800',
      vcard: 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type as keyof typeof styles]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    if (!date) return 'Never';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 
      'day'
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <QrCode className="h-8 w-8 mr-3 text-blue-600" />
                QR Code Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage artistic QR codes</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create QR Code
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search QR codes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="url">URL</option>
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="wifi">WiFi</option>
                <option value="vcard">vCard</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* QR Codes Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading QR codes...</span>
          </div>
        ) : filteredQRCodes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No QR codes found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qr) => (
              <div key={qr.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* QR Code Preview */}
                <div className="h-48 bg-gray-50 flex items-center justify-center border-b">
                  <div 
                    className="w-32 h-32 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: qr.design.backgroundColor,
                      border: `2px solid ${qr.design.color}`
                    }}
                  >
                    <QrCode 
                      className="h-24 w-24" 
                      style={{ color: qr.design.color }}
                    />
                  </div>
                </div>
                
                {/* QR Code Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{qr.name}</h3>
                    <div className="flex space-x-1">
                      {getTypeBadge(qr.type)}
                      {getStatusBadge(qr.status)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 truncate">{qr.content}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {formatNumber(qr.stats.scans)} scans
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(qr.stats.lastScan || new Date(0))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      By {qr.createdBy} • {qr.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredQRCodes.length}</span> of{' '}
            <span className="font-medium">{qrCodes.length}</span> QR codes
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
