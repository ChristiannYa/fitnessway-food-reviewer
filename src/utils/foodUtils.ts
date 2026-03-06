import type { FoodBase, PendingFoodStatus } from "@/types/foodTypes";

export const isReviewed = (status: PendingFoodStatus): boolean => status !== "PENDING";

export const getPendingFoodStatusColor = (status: PendingFoodStatus): string => {
	switch (status) {
		case "APPROVED":
			return "text-emerald-500";
		case "PENDING":
			return "text-amber-500";
		case "REJECTED":
			return "text-red-500";
	}
};

export const getAmountPerServingView = (food: FoodBase): string =>
	`${food.amountPerServing} ${food.servingUnit.toLowerCase()}`;
