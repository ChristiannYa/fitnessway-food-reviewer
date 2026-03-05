import type { PendingFoodStatus } from "@/types/foodTypes";

export const getPendingFoodStatusColor = (foodStatus: PendingFoodStatus): string => {
	switch (foodStatus) {
		case "APPROVED":
			return "text-emerald-500";
		case "PENDING":
			return "text-amber-500";
		case "REJECTED":
			return "text-red-500";
	}
};
