import type { FoodBase, PendingFoodStatus } from "@/types/foodTypes";
import { Ban, CircleCheckBig, Clock12 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const isReviewed = (status: PendingFoodStatus): boolean => status !== "PENDING";

export const getAmountPerServingFmt = (food: FoodBase): string =>
	`${food.amountPerServing} ${food.servingUnit.toLowerCase()}`;

export const getPendingFoodStatusUi = (
	status: PendingFoodStatus
): {
	accentTw: string;
	accentHex: string;
	Icon: LucideIcon;
} => {
	switch (status) {
		case "APPROVED":
			return {
				accentTw: "emerald-500",
				accentHex: "#10b981",
				Icon: CircleCheckBig
			};
		case "PENDING":
			return {
				accentTw: "amber-500",
				accentHex: "#f59e0b",
				Icon: Clock12
			};
		case "REJECTED":
			return {
				accentTw: "red-500",
				accentHex: "#ef4444",
				Icon: Ban
			};
	}
};
