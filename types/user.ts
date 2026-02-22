export type UserPayload = {
    userId: string;
};

export type PublicProfile = {
    id: string;
    username: string;
    latitude: number | null;
    longitude: number | null;
    score?: number;
    distance?: number;
    prompts: {
        prompt: {
            id: string;
            question: string;
            category: string;
        };
        answer: string;
    }[];
    interests: {
        interest: {
            id: string;
            name: string;
            category: string;
        };
        strength: string;
    }[];
};
