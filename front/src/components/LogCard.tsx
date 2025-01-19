import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

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

interface LogCardProps {
    logs: LogData[];
    loading: boolean;
}

function LogCard({ logs, loading }: LogCardProps) {
    const getStatusColor = () => {
        // Since status code is not in the API response, we'll assume success
        return 'text-green-600 bg-green-50';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Recent Logs</h2>
                    </div>
                    <span className="text-sm text-gray-500">{logs.length} entries</span>
                </div>

                {logs.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No logs found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log, index) => (
                            <div
                                key={index}
                                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor()}`}>
                      200
                    </span>
                                        <span className="ml-2 text-sm font-medium text-gray-900">{log.ClientRequestMethod}</span>
                                        <span className="ml-2 text-sm text-gray-500 truncate">{log.ClientRequestPath}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                    {new Date(log.EdgeStartTimestamp).toLocaleString()}
                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{log.ClientIP}</span>
                                    <span className="text-gray-500 truncate max-w-xs" title={log.ClientRequestUserAgent}>
                    {log.ClientRequestUserAgent}
                  </span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    <span className="mr-4">Host: {log.ClientRequestHost}</span>
                                    <span className="mr-4">Country: {log.ClientCountry.toUpperCase()}</span>
                                    <span>Device: {log.ClientDeviceType}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LogCard;