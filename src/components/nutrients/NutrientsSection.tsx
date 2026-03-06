import type { NutrientInFood } from "@/types/nutrientTypes";
import { NutrientRow } from "./NutrientRow";

export const NutrientsSection = ({
	nutrientsInFood
}: {
	nutrientsInFood: NutrientInFood[];
}) => {
	return (
		<div className="bg-burnt/80 rounded-lg divide-y divide-mist/20 px-3 py-1">
			{nutrientsInFood.length > 0 && (
				<>
					{nutrientsInFood.map((nif) => (
						<div key={nif.nutrientData.base.id}>
							<NutrientRow nutrient={nif} />
						</div>
					))}
				</>
			)}
		</div>
	);
};
