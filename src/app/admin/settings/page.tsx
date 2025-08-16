/**
 * Settings Page
 */

'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Users,
  Palette,
  Download,
  Upload
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'QRArtistry',
    siteDescription: 'Create beautiful, artistic QR codes',
    maintenanceMode: false,
    
    // Security Settings
    requireEmailVerification: true,
    enableTwoFactor: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    
    // Email Settings
    emailProvider: 'ses',
    fromEmail: 'noreply@qrartistry.com',
    fromName: 'QRArtistry',
    
    // Notification Settings
    enableNotifications: true,
    emailNotifications: true,
    systemAlerts: true,
    
    // API Settings
    enablePublicAPI: false,
    rateLimitRequests: 1000,
    rateLimitWindow: 60,
    
    // UI Settings
    primaryColor: '#2563eb',
    theme: 'light',
    logo: null
  });

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General',
      description: 'Basic site configuration',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Authentication and security settings',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Email configuration and templates',
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'System notifications and alerts',
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: 'api',
      title: 'API',
      description: 'API access and rate limiting',
      icon: <Database className="h-5 w-5" />
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'UI theme and branding',
      icon: <Palette className="h-5 w-5" />
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    // In a real app, this would make an API call
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.maintenanceMode}
          onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
        />
        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
          Enable maintenance mode
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="requireEmailVerification"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.requireEmailVerification}
          onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
        />
        <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
          Require email verification for new accounts
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableTwoFactor"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.enableTwoFactor}
          onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
        />
        <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
          Enable two-factor authentication
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Password Length
        </label>
        <input
          type="number"
          min="6"
          max="50"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.passwordMinLength}
          onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          min="5"
          max="1440"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Provider
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.emailProvider}
          onChange={(e) => handleSettingChange('emailProvider', e.target.value)}
        >
          <option value="ses">Amazon SES</option>
          <option value="sendgrid">SendGrid</option>
          <option value="mailgun">Mailgun</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Email
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.fromEmail}
          onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.fromName}
          onChange={(e) => handleSettingChange('fromName', e.target.value)}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableNotifications"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.enableNotifications}
          onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
        />
        <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-900">
          Enable system notifications
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="emailNotifications"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.emailNotifications}
          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
        />
        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
          Send email notifications
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="systemAlerts"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.systemAlerts}
          onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
        />
        <label htmlFor="systemAlerts" className="ml-2 block text-sm text-gray-900">
          Show system alerts
        </label>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enablePublicAPI"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={settings.enablePublicAPI}
          onChange={(e) => handleSettingChange('enablePublicAPI', e.target.checked)}
        />
        <label htmlFor="enablePublicAPI" className="ml-2 block text-sm text-gray-900">
          Enable public API access
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limit (requests per window)
        </label>
        <input
          type="number"
          min="100"
          max="10000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.rateLimitRequests}
          onChange={(e) => handleSettingChange('rateLimitRequests', parseInt(e.target.value))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limit Window (minutes)
        </label>
        <input
          type="number"
          min="1"
          max="1440"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.rateLimitWindow}
          onChange={(e) => handleSettingChange('rateLimitWindow', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <input
          type="color"
          className="h-10 w-20 border border-gray-300 rounded-lg"
          value={settings.primaryColor}
          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={settings.theme}
          onChange={(e) => handleSettingChange('theme', e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'api':
        return renderAPISettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <SettingsIcon className="h-8 w-8 mr-3 text-blue-600" />
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    <span className="ml-3">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {sections.find(s => s.id === activeSection)?.description}
                </p>
              </div>
              
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
