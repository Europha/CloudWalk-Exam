import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Brain, RefreshCcw, Search } from 'lucide-react';
import LogCard from '../components/LogCard';
import AIAnalysisCard from '../components/AIAnalysisCard';
import BlacklistCard from '../components/BlacklistCard';

interface LogData {
  ClientIP: string;
  ClientRequestHost: string;
  ClientRequestMethod: string;
  ClientRequestURI: string;
  EdgeStartTimestamp: string;
  ZoneName: string;
  ClientASN: string;
  ClientCountry: string;
  ClientDeviceType: string;
  ClientSrcPort: string;
  ClientRequestBytes: string;
  ClientRequestPath: string;
  ClientRequestReferer: string;
  ClientRequestScheme: string;
  ClientRequestUserAgent: string;
}

interface BlacklistedIP {
  id: number;
  ip: string;
  reason: string;
  created_at: string;
}
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
function Dashboard() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [blacklistLoading, setBlacklistLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {

      const response = await fetch('http://localhost:3000/api/data/preview?headers=false', {
        headers: {
          'Authorization': `Bearer ${getCookie('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlacklist = async () => {
    setBlacklistLoading(true);
    try {
      const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

      const response = await fetch('http://localhost:3000/api/sec/list', {
        headers: {
          'Authorization': `Bearer ${getCookie('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blacklist');
      }

      const data = await response.json();
      setBlacklist(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching blacklist:', error);
    } finally {
      setBlacklistLoading(false);
    }
  };

  const refreshData = () => {
    fetchLogs();
    fetchBlacklist();
  };

  useEffect(() => {
    fetchLogs();
    fetchBlacklist();
  }, []);

  const filteredLogs = logs.filter(log =>
      log.ClientIP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ClientRequestPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ClientRequestMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
              </div>
              <button
                  onClick={refreshData}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Banner */}
          <div className="mb-6 flex items-center bg-red-50 p-4 rounded-md text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Monitoring active - Analyzing traffic patterns for potential threats</span>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Logs Section */}
            <div className="lg:col-span-2 space-y-6">
              <LogCard logs={filteredLogs} loading={loading} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <BlacklistCard blacklist={blacklist} loading={blacklistLoading} />
              <AIAnalysisCard />
            </div>
          </div>
        </main>
      </div>
  );
}

export default Dashboard;