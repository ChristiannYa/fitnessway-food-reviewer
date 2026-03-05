import type { PendingFood } from "@/types/foodTypes";
import { getPendingFoodStatusColor } from "@/utils/foodUtils";
import { formatIsoDate } from "@/utils/textUtils";

export const PendingFoodsSummaryGrid = ({
	pendingFoods
}: {
	pendingFoods: PendingFood[];
}) => {
	if (pendingFoods.length === 0) {
		return <p className="text-center">No foods available</p>;
	}

	return (
		<div className="grid md:grid-cols-2 grid-cols-1 w-full md:w-160 max-w-full gap-2">
			{pendingFoods.map((pendingFood) => {
				return <PendingFoodSummary pendingFood={pendingFood} />;
			})}
		</div>
	);
};

const PendingFoodSummary = ({ pendingFood }: { pendingFood: PendingFood }) => {
	const foodBase = pendingFood.information.base;
	const amountPerServing = `${foodBase.amountPerServing} ${foodBase.servingUnit.toLowerCase()}`;
	const foodStatusColor = getPendingFoodStatusColor(pendingFood.status);

	return (
		<div>
			<div
				key={pendingFood.id}
				className="flex flex-col w-full pb-3 pt-1 border-2 border-smoke hover:border-mist 
                           cursor-default rounded-lg text-lg transition-colors"
			>
				<p className="text-center">{formatIsoDate(pendingFood.createdAt)}</p>
				<span className="mt-1 w-full border-t border-dotted border-smoke"></span>

				<div className="px-3 pt-3">
					<p className={`font-semibold ${foodStatusColor}`}>
						{pendingFood.status}
					</p>
					<p className="font-semibold truncate">{foodBase.name}</p>
					<p className="">{foodBase.brand}</p>
					<p>{amountPerServing}</p>
				</div>
			</div>
		</div>
	);
};
