import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserId } from '@/lib/serverAuth';
import { findUsersWithinRadius } from '@/lib/geo';
import { calculateMatchScore } from '@/lib/matching';

export async function GET(request: Request) {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            include: { interests: true },
        });

        if (!currentUser || !currentUser.latitude || !currentUser.longitude) {
            return NextResponse.json({ message: 'Location not set' }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const radiusStr = searchParams.get('radius') || '10'; // default 10km
        let radiusKm = parseFloat(radiusStr);
        if (isNaN(radiusKm)) radiusKm = 10;

        const interestKeyword = searchParams.get('interestKeyword') || '';
        const strength = searchParams.get('strength') || ''; // optional filter

        // Convert to meters for PostGIS
        const radiusMs = radiusKm * 1000;

        // Call raw query
        const nearbyUsersGeo = await findUsersWithinRadius(currentUser.latitude, currentUser.longitude, radiusMs, currentUserId);
        const nearbyUserIds = nearbyUsersGeo.map(u => u.id);

        if (nearbyUserIds.length === 0) {
            return NextResponse.json({ users: [] });
        }

        // Filters for Prisma finding nearby users' interests
        const interestFilter: any = {
            interest: { name: { contains: interestKeyword, mode: 'insensitive' } }
        };
        if (strength) {
            interestFilter.strength = strength;
        }

        // Fetch full profiles for nearby users that HAVE the required interest
        const nearbyUsers = await prisma.user.findMany({
            where: {
                id: { in: nearbyUserIds },
                interests: {
                    some: interestFilter
                }
            },
            include: {
                interests: { include: { interest: true } },
                prompts: { include: { prompt: true } },
            }
        });

        // Score and sort
        const scoredUsers = nearbyUsers.map(user => {
            const commonStr: { interestId: string; user1Strength: any; user2Strength: any }[] = [];
            user.interests.forEach(ui => {
                const match = currentUser.interests.find(cui => cui.interestId === ui.interestId);
                if (match) {
                    commonStr.push({
                        interestId: ui.interestId,
                        user1Strength: match.strength,
                        user2Strength: ui.strength
                    });
                }
            });

            const score = calculateMatchScore(commonStr);
            return {
                id: user.id,
                username: user.username,
                latitude: user.latitude,
                longitude: user.longitude,
                score,
                interests: user.interests,
                prompts: user.prompts
            };
        }).sort((a, b) => b.score - a.score); // descending

        return NextResponse.json({ users: scoredUsers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
