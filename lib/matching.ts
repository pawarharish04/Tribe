import { StrengthLevel } from '@prisma/client';

type CommonInterest = {
    interestId: string;
    user1Strength: StrengthLevel;
    user2Strength: StrengthLevel;
};

export const calculateMatchScore = (commonInterests: CommonInterest[]) => {
    let score = 0;

    for (const ci of commonInterests) {
        // Basic common interest score
        score += 10;

        // Strong interest check: if both have SERIOUS or CORE, or even just one is CORE - wait
        // Score rule: (commonInterests * 10) + (commonStrongInterests * 20)

        // Definition of 'Strong Interest': Let's say if both users have >= SERIOUS
        const isUser1Strong = ci.user1Strength === StrengthLevel.CORE || ci.user1Strength === StrengthLevel.SERIOUS;
        const isUser2Strong = ci.user2Strength === StrengthLevel.CORE || ci.user2Strength === StrengthLevel.SERIOUS;

        if (isUser1Strong && isUser2Strong) {
            score += 20;
        }
    }

    return score;
};
