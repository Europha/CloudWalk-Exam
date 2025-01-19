// dbConnectionFactory.ts
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_PWD = process.env.DATABASE_PWD || 'fallback-secret';

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'managementdb',
    password: DATABASE_PWD,
    port: 5432,
};

export class DBConnectionFactory {
    private static pool: Pool | null = null;

    public static getPoolConnection(): Pool {
        if (!DBConnectionFactory.pool) {
            DBConnectionFactory.pool = new Pool(dbConfig);
        }
        return DBConnectionFactory.pool;
    }

    public static getClientConnection(): Client {
        const client = new Client(dbConfig);
        client.connect();
        return client;
    }
}
