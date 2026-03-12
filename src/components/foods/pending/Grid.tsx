import type { PendingFood } from "@/types/foodTypes";
import {
	getAmountPerServingView,
	getPendingFoodStatusColorHex,
	getPendingFoodStatusColorTw
} from "@/utils/foodUtils";
import { formatIsoDate } from "@/utils/textUtils";
import { useState } from "react";
import { PendingFoodInformation } from "./Information";

export const Grid = ({
	pendingFoods,
	onApprove,
	onReject
}: {
	pendingFoods: PendingFood[];
	onApprove: (foodId: number) => void;
	onReject: (foodId: number, reason: string) => void;
}) => {
	const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

	const selectedFood =
		selectedFoodId !== null
			? pendingFoods.find((f) => f.id === selectedFoodId)
			: null;

	function handleFoodClick(food: PendingFood) {
		setSelectedFoodId(food.id);
	}

	if (pendingFoods.length === 0) {
		return <p className="text-center">No foods available</p>;
	}

	return (
		<>
			<div className="grid md:grid-cols-2 grid-cols-1 w-full md:w-160 max-w-full gap-2">
				{pendingFoods.map((pendingFood) => {
					return (
						<div key={pendingFood.id}>
							<PendingFoodSummary
								pendingFood={pendingFood}
								onFoodClick={handleFoodClick}
							/>
						</div>
					);
				})}
			</div>
			{selectedFood && (
				<div
					onClick={() => setSelectedFoodId(null)}
					className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-20"
				>
					<div onClick={(e) => e.stopPropagation()}>
						<PendingFoodInformation
							pendingFood={selectedFood}
							onApprove={onApprove}
							onReject={onReject}
						/>
					</div>
				</div>
			)}
		</>
	);
};

const PendingFoodSummary = ({
	pendingFood,
	onFoodClick
}: {
	pendingFood: PendingFood;
	onFoodClick?: (food: PendingFood) => void;
}) => {
	const foodBase = pendingFood.information.base;
	const amountPerServing = getAmountPerServingView(pendingFood.information.base);
	const statusColor = getPendingFoodStatusColorHex(pendingFood.status);

	return (
		<div
			onClick={() => onFoodClick?.(pendingFood)}
			className="flex flex-col w-full pb-3 pt-1 border-2 border-smoke hover:border-mist 
                        cursor-default rounded-lg text-lg transition-colors"
		>
			<p className="text-center">{formatIsoDate(pendingFood.createdAt)}</p>
			<span className="mt-1 w-full border-t border-dotted border-smoke"></span>

			<div className="flex flex-col px-3 pt-3 leading-snug">
				<p
					style={{
						color: statusColor
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
