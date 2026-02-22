export type InteractionDto = {
    id: string;
    fromUserId: string;
    toUserId: string;
    type: 'LIKE' | 'SIGNAL';
    createdAt: Date;
};

export type MatchUnlockDto = {
    id: string;
    user1Id: string;
    user2Id: string;
    unlockedAt: Date;
};
