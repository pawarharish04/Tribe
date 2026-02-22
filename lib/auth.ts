import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-fallback';

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        return payload;
    } catch (error) {
        return null;
    }
};
