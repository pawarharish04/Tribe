import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserId } from '@/lib/serverAuth';

export async function POST(request: Request) {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { matchId, content } = await request.json();

        if (!matchId || !content) {
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        }

        // Verify user is part of the match
        const match = await prisma.matchUnlock.findUnique({
            where: { id: matchId }
        });

        if (!match || (match.user1Id !== currentUserId && match.user2Id !== currentUserId)) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                matchId,
                senderId: currentUserId,
                content,
            }
        });

        return NextResponse.json({ message }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const matchId = searchParams.get('matchId');

        if (!matchId) return NextResponse.json({ message: 'Match ID required' }, { status: 400 });

        const match = await prisma.matchUnlock.findUnique({
            where: { id: matchId }
        });

        if (!match || (match.user1Id !== currentUserId && match.user2Id !== currentUserId)) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { matchId },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
