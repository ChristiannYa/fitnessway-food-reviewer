export const pagination = {
	limit: 6
};

export const mutationKeys = {
	food: {
		pending: {
			all: () => ["food", "pending"] as const,
			review: () => ["food", "pending", "review"] as const
		}
	}
};

export const queryKeys = {
	user: {
		all: () => ["user"] as const,
		me: () => ["user", "me"] as const
	},
	food: {
		pending: {
			all: () => ["food", "pending"] as const,
			byUserId: (offset: number, userId: string) =>
				["food", "pending", "byUserId", offset, userId] as const,
			byUserType: (offset: number, userType: string) =>
				["food", "pending", "byUserType", offset, userType] as const
		}
	}
};
