import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserId } from '@/lib/serverAuth';

export async function PUT(request: Request) {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        // Lazy reset check
        const user = await prisma.user.findUnique({ where: { id: currentUserId } });
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        const now = new Date();
        let interestChangesRemaining = user.interestChangesRemaining;
        let resetAt = user.resetAt;

        // Weekly reset check
        const msInWeek = 7 * 24 * 60 * 60 * 1000;
        if (now.getTime() - new Date(user.resetAt).getTime() > msInWeek) {
            interestChangesRemaining = 3;
            resetAt = now;
            await prisma.user.update({
                where: { id: currentUserId },
                data: { interestChangesRemaining: 3, resetAt: now }
            });
        }

        if (data.action === 'changeInterests') {
            if (interestChangesRemaining <= 0) {
                return NextResponse.json({ message: 'No interest changes remaining this week' }, { status: 400 });
            }

            const { newInterests } = data; // array of { interestId, strength }

            if (newInterests.length > 8) {
                return NextResponse.json({ message: 'Maximum 8 active interests allowed' }, { status: 400 });
            }

            await prisma.$transaction([
                prisma.userInterest.deleteMany({ where: { userId: currentUserId } }),
                prisma.userInterest.createMany({
                    data: newInterests.map((ni: any) => ({
                        userId: currentUserId,
                        interestId: ni.interestId,
                        strength: ni.strength || 'CURIOUS'
                    }))
                }),
                prisma.user.update({
                    where: { id: currentUserId },
                    data: { interestChangesRemaining: { decrement: 1 } }
                })
            ]);

            return NextResponse.json({ message: 'Interests updated' }, { status: 200 });
        }

        // Default update other fields like gps location
        if (data.latitude && data.longitude) {
            await prisma.user.update({
                where: { id: currentUserId },
                data: { latitude: data.latitude, longitude: data.longitude }
            });
        }

        return NextResponse.json({ message: 'User updated' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
