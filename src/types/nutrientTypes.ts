import type { ServingUnit } from "@/types/foodTypes";

export const NUTRIENT_TYPE = ["BASIC", "VITAMIN", "MINERAL"] as const;

export type NutrientType = (typeof NUTRIENT_TYPE)[number];

export type NutrientBase = {
	id: number;
	name: string;
	unit: ServingUnit;
	type: NutrientType;
	symbol?: string;
	isPremium: boolean;
};

export type NutrientPreferences = {
	hexColor?: string;
	goal?: number;
};

export type NutrientData = {
	base: NutrientBase;
	preferences: NutrientPreferences;
};

export type NutrientInFood = {
	nutrientData: NutrientData;
	amount: number;
};

export type NutrientIdWithAmount = {
	id: number;
	amount: number;
};

export type NutrientEntry = NutrientInFood | NutrientIdWithAmount;
