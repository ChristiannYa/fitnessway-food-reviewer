import type { PendingFood } from "@/types/foodTypes";

export const pendingFoodMock: PendingFood = {
	id: 1,
	status: "REJECTED",
	createdBy: "28b9e4a064cf-9a12-4e73-9a13-28b9e4a064cf",
	reviewedBy: "a2efecae-9a13-4e73-9a12-28b9e4a064cf",
	reviewedAt: "2026-03-04T14:30:00.000Z",
	createdAt: "2026-03-03T09:15:00.000Z",
	rejectionReason: "Nutritional values do not match the product label.",
	information: {
		base: {
			name: "Whole Grain Oats",
			brand: "Nature's Best",
			amountPerServing: 40,
			servingUnit: "G"
		},
		nutrients: [
			{
				amount: 150,
				nutrientData: {
					base: {
						id: 1,
						name: "Calories",
						unit: "KCAL",
						type: "BASIC",
						symbol: "kcal",
						isPremium: false
					},
					preferences: { hexColor: "#f97316", goal: 2000 }
				}
			},
			{
				amount: 27,
				nutrientData: {
					base: {
						id: 2,
						name: "Carbohydrates",
						unit: "G",
						type: "BASIC",
						symbol: undefined,
						isPremium: false
					},
					preferences: { hexColor: "#eab308", goal: 275 }
				}
			},
			{
				amount: 5,
				nutrientData: {
					base: {
						id: 3,
						name: "Protein",
						unit: "G",
						type: "BASIC",
						symbol: undefined,
						isPremium: false
					},
					preferences: { hexColor: "#3b82f6", goal: 50 }
				}
			},
			{
				amount: 3,
				nutrientData: {
					base: {
						id: 4,
						name: "Fat",
						unit: "G",
						type: "BASIC",
						symbol: undefined,
						isPremium: false
					},
					preferences: { hexColor: "#a855f7", goal: 78 }
				}
			},
			{
				amount: 4,
				nutrientData: {
					base: {
						id: 5,
						name: "Fiber",
						unit: "G",
						type: "BASIC",
						symbol: undefined,
						isPremium: false
					},
					preferences: { hexColor: "#22c55e", goal: 28 }
				}
			},
			{
				amount: 120,
				nutrientData: {
					base: {
						id: 6,
						name: "Sodium",
						unit: "MG",
						type: "MINERAL",
						symbol: "Na",
						isPremium: true
					},
					preferences: { hexColor: "#ef4444", goal: 2300 }
				}
			}
		]
	}
};
