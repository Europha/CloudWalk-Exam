import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';
export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    const tokenString = token.toString().split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, SECRET_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
