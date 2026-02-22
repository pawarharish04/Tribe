import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, username, password } = await request.json();

        if (!email || !username || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash: hashedPassword,
            },
        });

        const token = generateToken(user.id);

        const response = NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
        response.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800 });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
