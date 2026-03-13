import type { PendingFoodsReqParams } from "./types/foodTypes";
import type { UserType } from "./types/userTypes";

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
			byUserId: (params: PendingFoodsReqParams<{ userId: string }>) =>
				["food", "pending", "byUserId", params] as const,
			byUserType: (params: PendingFoodsReqParams<{ userType: UserType }>) =>
				["food", "pending", "byUserType", params] as const
		}
	}
};
