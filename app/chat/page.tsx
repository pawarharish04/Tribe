import { redirect } from 'next/navigation';
import { getUserOrRedirect } from '@/lib/serverAuth';
import prisma from '@/lib/prisma';
import ChatClient from './ChatClient';

export default async function ChatPage() {
    const user = await getUserOrRedirect();

    // Find all matches for this user
    const matches = await prisma.matchUnlock.findMany({
        where: {
            OR: [
                { user1Id: user.id },
                { user2Id: user.id }
            ]
        },
        include: {
            user1: { select: { id: true, username: true } },
            user2: { select: { id: true, username: true } },
            messages: { orderBy: { createdAt: 'asc' } }
        },
        orderBy: { unlockedAt: 'desc' }
    });

    const formattedMatches = matches.map(match => {
        const isUser1 = match.user1Id === user.id;
        const partner = isUser1 ? match.user2 : match.user1;

        return {
            id: match.id,
            partnerId: partner.id,
            partnerUsername: partner.username,
            messages: match.messages.map(m => ({ id: m.id, content: m.content, senderId: m.senderId }))
        };
    });

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Unlocked Chats</h1>
            {formattedMatches.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>You don't have any mutual signals yet.</p>
            ) : (
                <ChatClient currentUserId={user.id} initialMatches={formattedMatches} />
            )}
        </div>
    );
}
