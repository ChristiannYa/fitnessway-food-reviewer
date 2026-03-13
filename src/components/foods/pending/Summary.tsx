import type { PendingFood } from "@/types/foodTypes";
import { getAmountPerServingFmt, getPendingFoodStatusUi } from "@/utils/foodUtils";
import { formatIsoDate } from "@/utils/textUtils";

export const Summary = ({
	pendingFood,
	onFoodClick
}: {
	pendingFood: PendingFood;
	onFoodClick: (food: PendingFood) => void;
}) => {
	const foodBase = pendingFood.information.base;
	const amountPerServing = getAmountPerServingFmt(pendingFood.information.base);
	const { accentHex } = getPendingFoodStatusUi(pendingFood.status);

	return (
		<div
			onClick={() => onFoodClick(pendingFood)}
			className="flex flex-col w-full pb-3 pt-1 border-2 border-smoke hover:border-mist 
                       cursor-default rounded-lg text-lg"
		>
			<p className="text-center">{formatIsoDate(pendingFood.createdAt)}</p>
			<span className="mt-1 w-full border-t border-dotted border-smoke"></span>

			<div className="flex flex-col px-3 pt-3 leading-snug">
				<p
					style={{
						color: accentHex
					}}
					className="font-semibold"
				>
					{pendingFood.status}
				</p>
				<p className="font-semibold truncate">{foodBase.name}</p>
				<p className="opacity-80">{foodBase.brand}</p>
				<p className="opacity-80">{amountPerServing}</p>
			</div>
		</div>
	);
};
