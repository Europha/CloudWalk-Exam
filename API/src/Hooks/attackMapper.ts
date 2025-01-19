export const attackMapper = async (data: any[], verbose: boolean = false) => {
    const ipCounts: { [key: string]: { count: number, timestamps: string[], clientRequestPaths: string[] } } = {}; // Now also tracking clientRequestPaths

    try {
        data.forEach((row: any) => {
            const clientIP = row['ClientIP'] || '';
            const timestamp = row['EdgeStartTimestamp'] || '';
            const clientRequestPath = row['ClientRequestPath'] || '';
            if (clientIP && timestamp && clientRequestPath) {
                if (ipCounts[clientIP]) {
                    ipCounts[clientIP].count += 1;
                    ipCounts[clientIP].timestamps.push(timestamp);
                    ipCounts[clientIP].clientRequestPaths.push(clientRequestPath);
                } else {
                    ipCounts[clientIP] = {
                        count: 1,
                        timestamps: [timestamp],
                        clientRequestPaths: [clientRequestPath]
                    };
                }
            }
        });

        const sortedIps = Object.entries(ipCounts)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 10)
            .map(([ip, data]) => {
                const response: any = {
                    ip,
                    count: data.count,
                    clientRequestPaths: data.clientRequestPaths
                };

                if (verbose) {
                    response['timestamps'] = data.timestamps;
                }

                return response;
            });

        return sortedIps;

    } catch (error) {
        console.error('Error processing the data:', error);
        throw new Error('Error in attackMapper');
    }
};


