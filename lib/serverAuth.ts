import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import prisma from './prisma';
import { redirect } from 'next/navigation';

export async function getUserOrRedirect() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const payload = verifyToken(token);
    if (!payload) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    });

    if (!user) {
        redirect('/login');
    }

    return user;
}

export async function getUserId() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    return payload ? payload.userId : null;
}
