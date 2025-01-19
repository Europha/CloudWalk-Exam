import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';  // This will generate a random secret key

interface Payload {
    username: string;
}

export function generateJwtToken(payload: Payload): string {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
}

