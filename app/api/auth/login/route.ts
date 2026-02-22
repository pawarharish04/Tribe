import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = generateToken(user.id);

        const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
        response.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800 });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
