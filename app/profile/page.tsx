import { redirect } from 'next/navigation';
import { getUserOrRedirect } from '@/lib/serverAuth';
import prisma from '@/lib/prisma';
import ProfileClient from './ProfileClient';
import { PublicProfile } from '@/types/user';

export default async function ProfilePage() {
    const user = await getUserOrRedirect();

    const userWithInterests = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            interests: { include: { interest: true } },
            prompts: { include: { prompt: true } },
        }
    });

    if (!userWithInterests) return redirect('/login');

    const profileData: PublicProfile = {
        id: userWithInterests.id,
        username: userWithInterests.username,
        latitude: userWithInterests.latitude,
        longitude: userWithInterests.longitude,
        interests: userWithInterests.interests.map(ui => ({
            interest: { id: ui.interestId, name: ui.interest.name, category: ui.interest.category },
            strength: ui.strength,
        })),
        prompts: userWithInterests.prompts.map(up => ({
            prompt: { id: up.promptId, question: up.prompt.question, category: up.prompt.category },
            answer: up.answer,
        })),
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Profile</h1>
            <ProfileClient
                profile={profileData}
                changesRemaining={userWithInterests.interestChangesRemaining}
            />
        </div>
    );
}
