import type { PendingFood } from "@/types/foodTypes";
import {
	getAmountPerServingView,
	getPendingFoodStatusColor,
	isReviewed
} from "@/utils/foodUtils";
import { formatIsoDate, uuidFirst } from "@/utils/textUtils";
import { NutrientsSection } from "../nutrients/NutrientsSection";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export const PendingFoodInformation = ({ pendingFood }: { pendingFood: PendingFood }) => {
	const [isRejectionReasonVisible, setIsRejectionReasonVisible] =
		useState<boolean>(false);
	const hasRejectionReason =
		pendingFood.status === "REJECTED" && pendingFood.rejectionReason;

	const foodBase = pendingFood.information.base;
	const foodNutrients = pendingFood.information.nutrients;

	const amountPerServing = getAmountPerServingView(pendingFood.information.base);
	const statusColor = getPendingFoodStatusColor(pendingFood.status);

	const nutrients = foodNutrients.filter((fn) => fn.nutrientData.base.type === "BASIC");
	const vitamins = foodNutrients.filter(
		(fn) => fn.nutrientData.base.type === "VITAMIN"
	);
	const minerals = foodNutrients.filter(
		(fn) => fn.nutrientData.base.type === "MINERAL"
	);

	return (
		<div className="flex flex-col w-90 bg-smoke/40 rounded-xl relative overflow-hidden">
			{/* Header Bar */}
			<div
				className="flex items-center justify-between px-4 py-3 border-b border-smoke 
                           border-dotted text-lg"
			>
				<p>{formatIsoDate(pendingFood.createdAt)}</p>
				<div className="flex flex-col items-center gap-0">
					<p className={`${statusColor} font-bold leading-tight`}>
						{pendingFood.status}
					</p>
					{isReviewed(pendingFood.status) && (
						<p className="text-xs leading-tight">
							{uuidFirst(pendingFood.reviewedBy ?? "")}
						</p>
					)}
					{hasRejectionReason && (
						<MoreHorizontal
							onClick={() => setIsRejectionReasonVisible(true)}
							size={24}
							style={{
								padding: 2,
								cursor: "pointer"
							}}
						/>
					)}
				</div>
			</div>

			{/* Body */}
			<div className="px-4 pt-3 pb-4 gap-2 flex flex-col">
				{/* Base Information */}
				<div className="text-lg leading-tight truncate">
					<p className="font-semibold">{foodBase.name}</p>
					<p className="opacity-80">{foodBase.brand}</p>
					<p className="opacity-80">{amountPerServing}</p>
				</div>

				{/* Nutrients */}
				{nutrients.length > 0 && <NutrientsSection nutrientsInFood={nutrients} />}
				{vitamins.length > 0 && <NutrientsSection nutrientsInFood={vitamins} />}
				{minerals.length > 0 && <NutrientsSection nutrientsInFood={minerals} />}
			</div>

			{hasRejectionReason && isRejectionReasonVisible && (
				<div
					onClick={() => setIsRejectionReasonVisible(false)}
					className="flex flex-col items-center gap-2 w-full h-full p-3 mx-auto absolute  
                             bg-mist/10 rounded-md backdrop-blur-md overflow-auto no-scrollbar z-20"
				>
					<h2 className="text-lg font-medium leading-tight">
						Rejection Reason
					</h2>
					<p className="text-center">{pendingFood.rejectionReason}</p>
				</div>
			)}
		</div>
	);
};
