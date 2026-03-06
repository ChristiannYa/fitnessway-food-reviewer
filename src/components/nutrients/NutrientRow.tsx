import type { NutrientInFood } from "@/types/nutrientTypes";

export const NutrientRow = ({ nutrient }: { nutrient: NutrientInFood }) => {
	const { base } = nutrient.nutrientData;

	return (
		<div className="flex items-center gap-2 py-1">
			<p className="flex-1 text-sm truncate">
				{base.symbol ? `${base.name} (${base.symbol})` : base.name}
			</p>

			<p className="font-medium">
				{nutrient.amount}{" "}
				<span className="font-normal text-gray-400">
					{base.unit.toLowerCase()}
				</span>
			</p>
		</div>
	);
};
