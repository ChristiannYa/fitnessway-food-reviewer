export type UserType = "ADMIN" | "CONTRIBUTOR" | "USER";

export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    isPremium: boolean;
    createdAt: string;
    updatedAt: string;
    type: UserType;
};

export type UserRes = {
    user: User;
};