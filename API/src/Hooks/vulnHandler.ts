
export const vulnHandler = async (data: any[], depth=3) => {

    const regexVulnerabilities = new RegExp(process.env.VULNERABILITY_REGEX as string, 'i');
    if(depth===3){
    try {
        const rowsWithVulnerabilities = data.filter((row: any) => {
            const clientRequestPath = row.ClientRequestPath || '';
            return regexVulnerabilities.test(clientRequestPath);
        });

        const suspectIps = rowsWithVulnerabilities.map((row: any) => row.ClientIP).filter((ip: string | null) => ip !== null);

        return suspectIps;

    } catch (error) {
        console.error('Error detecting vulnerabilities in ClientRequestPath:', error);
        throw new Error('Error processing the data');
    }

    }
    if(depth===4){
    try {
        const rowsWithVulnerabilities = data.filter((row: any) => {
            const clientRequestPaths = row.clientRequestPaths || [];
            return clientRequestPaths.some((path: string) => regexVulnerabilities.test(path));
        });

        const ipVulns = rowsWithVulnerabilities.map((row: any) => {
            const vulnPaths = row.clientRequestPaths.filter((path: string) => regexVulnerabilities.test(path)); // Get matching paths
            return {
                ip: row.ip,
                vulnCount: vulnPaths.length,
                timestamps: row.timestamps
            };
        });

        return ipVulns;

    } catch (error) {
        console.error('Error in vulnHandler:', error);
        throw new Error('Error in vulnHandler');
    }
    }
};
