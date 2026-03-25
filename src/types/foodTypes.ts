import type { PaginationResult } from "@/types/appTypes";
import type { NutrientsByType } from "@/types/nutrientTypes";
import type { UserType } from "./userTypes";

export const SERVING_UNIT = ["G", "MG", "MCG", "ML", "OZ", "KCAL"] as const;

export type ServingUnit = (typeof SERVING_UNIT)[number];

export const PENDING_FOOD_STATUS = ["APPROVED", "PENDING", "REJECTED"] as const;

export type PendingFoodStatus = (typeof PENDING_FOOD_STATUS)[number];

export type FoodBase = {
	name: string;
	brand?: string;
	amountPerServing: number;
	servingUnit: ServingUnit;
};

export type FoodInformation = {
	base: FoodBase;
	nutrients: NutrientsByType;
};

export type AppFood = {
	id: number;
	information: FoodInformation;
	createdBy?: string;
	createdAt: string;
	updatedAt?: string;
};

export type PendingFood = {
	id: number;
	information: FoodInformation;
	status: PendingFoodStatus;
	createdBy?: string;
	reviewedBy?: string;
	reviewedAt?: string;
	createdAt: string;
	rejectionReason?: string;
};

export type PendingFoodReview = Pick<
	PendingFood,
	"status" | "createdBy" | "reviewedBy" | "reviewedAt" | "rejectionReason"
>;

export type PendingFoodsReqParams<T extends { userId: string } | { userType: UserType }> =
	{
		offset: number;
		status?: PendingFoodStatus;
	} & T;

export type PendingFoodsByUserIdRes = {
	pendingFoodsPagination: PaginationResult<PendingFood>;
};

export type PendingFoodsByUserTypeRes = {
	pendingFoodsPagination: PaginationResult<PendingFood>;
};

export type PendingFoodReviewReq = {
	pendingFoodId: number;
	rejectionReason: string | null;
};

export type PendingFoodReviewRes = {
	pendingFoodReviewed: PendingFood;
};
