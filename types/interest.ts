export type InterestDto = {
    id: string;
    name: string;
    category: string;
};

export type UserInterestDto = {
    interest: InterestDto;
    strength: 'CURIOUS' | 'SERIOUS' | 'CORE';
};
