import { Pool } from 'pg';
import { DBConnectionFactory } from '../Factory/databaseFactory.ts'; // Assuming your DB connection is here

const pool = DBConnectionFactory.getPoolConnection();

export const addToBlacklist = async (ip: string, reason: string) => {
    try {
        const checkQuery = 'SELECT * FROM blacklist WHERE ip = $1';
        const { rows } = await pool.query(checkQuery, [ip]);

        if (rows.length > 0) {
            console.log(`IP ${ip} is already in the blacklist`);
            return;
        }

        const insertQuery = `
            INSERT INTO blacklist (ip, reason, created_at)
            VALUES ($1, $2, NOW())
        `;
        await pool.query(insertQuery, [ip, reason]);
        console.log(`IP ${ip} added to blacklist for reason: ${reason}`);
    } catch (error) {
        console.error('Error adding IP to blacklist:', error);
        throw new Error('Error adding to blacklist');
    }
};
