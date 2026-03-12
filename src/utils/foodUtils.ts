import type { FoodBase, PendingFoodStatus } from "@/types/foodTypes";

export const isReviewed = (status: PendingFoodStatus): boolean => status !== "PENDING";

/**
 * @param status The pending food status
 * @returns tailwind color e.g., "[]-emerald-500". Prefix (text-, bg-) should be provided when used
 */
export const getPendingFoodStatusColorTw = (status: PendingFoodStatus): string => {
	switch (status) {
		case "APPROVED":
			return "emerald-500";
		case "PENDING":
			return "amber-500";
		case "REJECTED":
			return "red-500";
	}
};

export const getPendingFoodStatusColorHex = (status: PendingFoodStatus): string => {
	switch (status) {
		case "APPROVED":
			return "#10b981";
		case "PENDING":
			return "#f59e0b";
		case "REJECTED":
			return "#ef4444";
	}
};

export const getAmountPerServingView = (food: FoodBase): string =>
	`${food.amountPerServing} ${food.servingUnit.toLowerCase()}`;
