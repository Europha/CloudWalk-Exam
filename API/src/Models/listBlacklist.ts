import { Pool } from 'pg';
import { DBConnectionFactory } from '../Factory/databaseFactory.ts'; // Assuming your DB connection is here

const pool = DBConnectionFactory.getPoolConnection();
export const listBlacklist = async (): Promise<BlacklistRow[] | null> => {
    try {
        // Select all rows from the blacklist table
        const query = 'SELECT * FROM blacklist';
        const { rows } = await pool.query(query);

        if (rows.length > 0) {
            console.log('Retrieved blacklisted IPs:', rows);
            return rows;  // Return all rows as a JSON response
        } else {
            console.log('No blacklisted IPs found');
            return null;  // Return null if no rows found
        }
    } catch (err) {
        console.error('Error querying the blacklist table:', err);
        return null;  // Handle errors and return null
    }
}