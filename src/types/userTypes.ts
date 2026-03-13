export const USER_TYPE = ["ADMIN", "CONTRIBUTOR", "USER"] as const;

export type UserType = (typeof USER_TYPE)[number];

export const USER_SCOPE = ["User Type", "User ID"] as const;

export type UserScope = (typeof USER_SCOPE)[number];

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
