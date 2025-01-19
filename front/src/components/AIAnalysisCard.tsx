import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Utility function to get a cookie by its name
function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

interface IPVulnData {
    ip: string;
    vulnCount: number;
}

function AIAnalysisCard() {
    const [data, setData] = useState<IPVulnData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Retrieve the token from cookies
    const token = getCookie('auth_token'); // Replace with your actual cookie name

    useEffect(() => {
        if (!token) {
            setError('No valid token found.');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/api/sec/ip?depth=4', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Use the token from cookie
                    },
                });
                setData(response.data);  // Assuming the response is in the format of IPVulnData[]
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">IP Vulnerability Analysis</h2>
                <p className="text-sm text-gray-600">Displaying IP addresses and their respective vulnerability counts.</p>
            </div>

            <div className="space-y-4">
                {/* IP Vulnerability List */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">IP Vulnerability Counts</h3>
                    <table className="min-w-full mt-4 table-auto">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">IP Address</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Vulnerability Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="px-4 py-2 text-sm text-gray-700">{item.ip}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{item.vulnCount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AIAnalysisCard;
