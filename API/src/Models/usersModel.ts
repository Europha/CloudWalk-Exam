import { Pool, Client } from 'pg';
import { DBConnectionFactory } from '../Factory/databaseFactory.ts'; // Make sure this path is correct
import crypto from 'crypto';

const hashPassword = (password: string): string => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

export  const  validateUserLogin = async (username: string, password: string) => {
    const pool = DBConnectionFactory.getPoolConnection();

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return false;
        }

        const user = result.rows[0];
        console.log(result.rows)
        const hashedPassword = hashPassword(password);

        if (hashedPassword === user.password) {
            console.log('Login successful');
            return true;
        } else {
            console.log('Invalid password');
            return false;
        }
    } catch (error) {
        console.error('Error validating login:', error);
        return false;
    }
};
