export const pagination = {
	limit: 6
};

export const mutationKeys = {
    food: {
        pending: {
            all: () => ["food", "pending"] as const,

            review: () => [...mutationKeys.food.pending.all(), "review"]
        }
    }
}

export const queryKeys = {
	user: {
		all: () => ["user"] as const,

        me: () => [...queryKeys.user.all(), "me"]
	},
	food: {
		pending: {
			all: () => ["food", "pending"] as const,

			byUserId: (offset: number, userId: string) => [
                ...queryKeys.food.pending.all(), 
                "byUserId", 
                offset,
                userId 
            ] as const,

			byUserType: (offset: number, userType: string) => [
                ...queryKeys.food.pending.all(),
                "byUserType",
                offset,
                userType
            ] as const
		}
	}
};
