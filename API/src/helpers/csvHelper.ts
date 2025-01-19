import Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

import * as fs from 'fs';
import { parse } from 'csv-parse';

export const fetchCsvData = async (filePath: string): Promise<{ headers: string[], data: any[] }> => {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map((header: string) => header.trim());

    return new Promise<{ headers: string[], data: any[] }>((resolve, reject) => {

        parse(fileContent, {
            delimiter: ',',
            columns: headers,
            skip_empty_lines: true,
        }, (error, result: any[]) => {
            if (error) {
                reject(error);
                return;
            }

            resolve({
                headers,
                data: result,
            });
        });
    });
};

export const getRandomPreview = (data: any[], count: number = 20): any[] => {
    const result: any[] = [];
    const dataLength = data.length;

    const randomCount = Math.min(count, dataLength);

    const shuffledData = [...data];
    for (let i = dataLength - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }

    result.push(...shuffledData.slice(0, randomCount));

    return result;
};


export const trailCsv = (data: any[]) => {
    const clientIPs = data.map((row: any) => row.ClientIP);
    const uniqueClientIPs = [...new Set(clientIPs)];
    return uniqueClientIPs
}