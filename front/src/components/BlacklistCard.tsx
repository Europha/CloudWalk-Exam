import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface BlacklistedIP {
    id: number;
    ip: string;
    reason: string;
    created_at: string;
}

interface BlacklistCardProps {
    blacklist: BlacklistedIP[];
    loading: boolean;
}

function BlacklistCard({ blacklist, loading }: BlacklistCardProps) {
    // Get 3 random items from the blacklist
    const getRandomItems = (items: BlacklistedIP[], count: number) => {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    const randomBlacklist = getRandomItems(blacklist, 3);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-red-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Blacklisted IPs</h2>
                </div>

                {blacklist.length === 0 ? (
                    <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No blacklisted IPs</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {randomBlacklist.map((item) => (
                            <div
                                key={item.id}
                                className="border border-red-100 rounded-lg p-4 bg-red-50"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-red-700">{item.ip}</span>
                                    <span className="text-xs text-red-600">
                                        {new Date(item.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-red-600">{item.reason}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BlacklistCard;