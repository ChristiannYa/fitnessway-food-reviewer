import type { PaginationResult } from "@/types/appTypes";
import type { NutrientEntry, NutrientInFood } from "@/types/nutrientTypes";

export const SERVING_UNIT = ["G", "MG", "MCG", "ML", "OZ", "KCAL"] as const;

export type ServingUnit = (typeof SERVING_UNIT)[number];

export const PENDING_FOOD_STATUS = ["PENDING", "APPROVED", "REJECTED"] as const;

export type PendingFoodStatus = (typeof PENDING_FOOD_STATUS)[number];

export type FoodBase = {
	name: string;
	brand?: string;
	amountPerServing: number;
	servingUnit: ServingUnit;
};

export type FoodInformation<N extends NutrientEntry> = {
	base: FoodBase;
	nutrients: N[];
};

export type AppFood = {
	id: number;
	information: FoodInformation<NutrientInFood>;
	createdBy?: string;
	createdAt: string;
	updatedAt?: string;
};

export type PendingFood = {
	id: number;
	information: FoodInformation<NutrientInFood>;
	status: PendingFoodStatus;
	createdBy?: string;
	reviewedBy?: string;
	reviewedAt?: string;
	createdAt: string;
	rejectionReason?: string;
};

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
