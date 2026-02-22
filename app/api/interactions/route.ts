import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserId } from '@/lib/serverAuth';
import { rateLimit } from '@/lib/rateLimit';
import { InteractionType } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { toUserId, type } = await request.json();

        if (!toUserId || !type || (type !== 'LIKE' && type !== 'SIGNAL')) {
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        }

        if (currentUserId === toUserId) {
            return NextResponse.json({ message: 'Cannot interact with yourself' }, { status: 400 });
        }

        // Rate limit: 5 signals per day
        if (type === 'SIGNAL') {
            // Identifier for daily signals
            const identifier = `signal_limit_${currentUserId}_${new Date().toISOString().split('T')[0]}`;
            // 5 per day, window 24h=86400000ms
            const isAllowed = await rateLimit(identifier, 5, 86400000);
            if (!isAllowed) {
                return NextResponse.json({ message: 'Daily signal limit reached (5/day)' }, { status: 429 });
            }
        }

        // Upsert or create interaction
        await prisma.interaction.upsert({
            where: {
                fromUserId_toUserId_type: {
                    fromUserId: currentUserId,
                    toUserId,
                    type: type as InteractionType,
                }
            },
            update: {},
            create: {
                fromUserId: currentUserId,
                toUserId,
                type: type as InteractionType,
            }
        });

        let matchUnlocked = false;

        // Check mutual signal unlock chat logic
        if (type === 'SIGNAL') {
            const mutualSignal = await prisma.interaction.findUnique({
                where: {
                    fromUserId_toUserId_type: {
                        fromUserId: toUserId,
                        toUserId: currentUserId,
                        type: 'SIGNAL',
                    }
                }
            });

            if (mutualSignal) {
                // Create MatchUnlock if not exists
                const existingMatch = await prisma.matchUnlock.findFirst({
                    where: {
                        OR: [
                            { user1Id: currentUserId, user2Id: toUserId },
                            { user1Id: toUserId, user2Id: currentUserId }
                        ]
                    }
                });

                if (!existingMatch) {
                    await prisma.matchUnlock.create({
                        data: {
                            user1Id: currentUserId,
                            user2Id: toUserId,
                        }
                    });
                    matchUnlocked = true;
                }
            }
        }

        return NextResponse.json({ message: 'Interaction created', matchUnlocked }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
