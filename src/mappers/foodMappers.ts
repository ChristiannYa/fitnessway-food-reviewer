import type { PendingFood, PendingFoodReview } from "@/types/foodTypes";

export const toPendingFoodReview = (food: PendingFood): PendingFoodReview => ({
	status: food.status,
	createdBy: food.createdBy,
	reviewedBy: food.reviewedBy,
	reviewedAt: food.reviewedAt,
	rejectionReason: food.rejectionReason
});
