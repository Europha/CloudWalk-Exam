import axios from 'axios';
import path from 'path';
import {fetchCsvData, getRandomPreview, trailCsv} from "../helpers/csvHelper.ts";
import {vulnHandler} from "./vulnHandler.ts";
import {attackMapper} from "./attackMapper.ts";
import {addToBlacklist} from "../Models/blacklistModel.ts";

const API_IPINFO_KEY = process.env.API_IPINFO_KEY || 'fallback-secret';  // This will generate a random secret key
const IPINFO_API_URL = 'https://ipinfo.io';
const IPINFO_API_KEY = API_IPINFO_KEY;  // Replace this with your actual IPInfo API key

// Middleware function to check if the Client's IP is valid
export const checkClientIp = async (req: any, res: any, depth: number, ban: boolean) => {
    const csvFilePath = path.resolve(__dirname, '../routes/teste.csv');
    const { data } = await fetchCsvData(csvFilePath);

    if (depth === 1) {
        try {
            const previewData = getRandomPreview(data, 10);
            const ipClient = trailCsv(previewData)

            const ipInfoPromises = ipClient.map((ip: string) =>
                axios.get(`${IPINFO_API_URL}/${ip}/json?token=${IPINFO_API_KEY}`)
            );
            const ipInfoResponses = await Promise.all(ipInfoPromises);
            const allIpInfo = ipInfoResponses.map(response => response.data);
            return res.json(allIpInfo);
        } catch (error) {
            console.error('Error fetching IP info for depth 1:', error);
            throw new Error('Error fetching IP info for depth 1');
        }
    }

    if (depth === 2) {
        try {

            if (!Array.isArray(data)) {
                throw new Error('Expected an array from fetchCsvData, but received: ' + typeof data);
            }
            const ipClient = trailCsv(data)
            const ipInfoPromises = ipClient.map((ip: string) =>
                axios.get(`${IPINFO_API_URL}/${ip}/json?token=${IPINFO_API_KEY}`)
            );
            const ipInfoResponses = await Promise.all(ipInfoPromises);
            const allIpInfo = ipInfoResponses.map(response => response.data);
            return allIpInfo;
        } catch (error) {
            console.error('Error fetching IP info for multiple IPs:', error);
            throw new Error('Error fetching IP info');
        }
    }
    if (depth === 3) {
        const previewData = getRandomPreview(data, 10);
        try {
            // Await the result of vulnHandler since it's asynchronous
            const ipClient = await vulnHandler(previewData, 3);

            // Proceed with the rest of the logic after getting the ipClient
            const checker = trailCsv(ipClient); // Assuming this is another function that processes the IPs

            // If checker is an array of IPs, use them for axios requests
            const ipInfoPromises = ipClient.map((ip: string) =>
                axios.get(`${IPINFO_API_URL}/${ip}/json?token=${IPINFO_API_KEY}`)
            );

            // Await the IP info responses
            const ipInfoResponses = await Promise.all(ipInfoPromises);

            // Map the responses to the data
            const allIpInfo = ipInfoResponses.map(response => response.data);

            // Send the IP info as the response
            return res.json(allIpInfo);
        } catch (error) {
            console.error("Error processing IP information:", error);
            return res.status(500).json({ error: error.message });
        }


        }
    if (depth === 4) {
        const dataFilter = await attackMapper(data, false);

        const vulnResult = await vulnHandler(dataFilter, 4);
        for (const entry of vulnResult) {
            const { ip, vulnCount } = entry;
            console.log(ip, vulnCount)
            if (vulnCount > 10 && ban) {
               await addToBlacklist(ip, "More than 10 attack attempts");
            }
        }
        return res.json(vulnResult)
        // Return the final result after processing
    }
    }
