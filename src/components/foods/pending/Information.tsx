import { ActionButton } from "@/components/elements/ActionButton";
import { NutrientsSection } from "@/components/nutrients/NutrientsSection";
import { toPendingFoodReview } from "@/mappers/foodMappers";
import type { FoodInformation, PendingFood } from "@/types/foodTypes";
import type { NutrientInFood } from "@/types/nutrientTypes";
import {
	getAmountPerServingView,
	getPendingFoodStatusColorHex,
	isReviewed
} from "@/utils/foodUtils";
import { formatIsoDate } from "@/utils/textUtils";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { RejectionWriting } from "./RejectionWriting";
import { ReviewInformation } from "./ReviewInformation";

export const PendingFoodInformation = ({
	pendingFood,
	onApprove,
	onReject
}: {
	pendingFood: PendingFood;
	onApprove: (foodId: number) => void;
	onReject: (foodId: number, reason: string) => void;
}) => {
	const [isRejecting, setIsRejecting] = useState<boolean>(false);
	const [isReviewInfoVisible, setIsReviewInfoVisible] = useState(false);

	const reviewInfo = toPendingFoodReview(pendingFood);

	function handleReject(reason: string) {
		setIsRejecting(false);
		onReject(pendingFood.id, reason);
	}

	return (
		<div className="flex flex-col w-90 bg-smoke/40 rounded-xl relative overflow-hidden">
			<Header
				pendingFood={pendingFood}
				// onViewRejectionReason={() => setIsRejectionReasonVisible(true)}
				onViewReviewInfo={() => setIsReviewInfoVisible(true)}
			/>

			<Body pendingFoodInformation={pendingFood.information} />

			{/* Review Buttons Handlers */}
			{!isRejecting && !isReviewed(pendingFood.status) && (
				<div className="flex w-full pb-4 px-4 gap-2">
					<ActionButton
						label="Approve"
						icon={Check}
						bgColor="bg-dry-green"
						onButtonClick={() => onApprove(pendingFood.id)}
					/>
					<ActionButton
						label="Reject"
						icon={X}
						bgColor="bg-rose-600"
						onButtonClick={() => setIsRejecting(true)}
					/>
				</div>
			)}

			{isReviewInfoVisible && (
				<ReviewInformation
					review={reviewInfo}
					onClose={() => setIsReviewInfoVisible(false)}
				/>
			)}

			{isRejecting && (
				<RejectionWriting
					onCancelRejection={() => setIsRejecting(false)}
					onReject={(reason) => handleReject(reason)}
				/>
			)}
		</div>
	);
};

const Header = ({
	pendingFood,
	onViewReviewInfo
}: {
	pendingFood: PendingFood;
	onViewReviewInfo: () => void;
}) => {
	const statusColor = getPendingFoodStatusColorHex(pendingFood.status);

	return (
		<div
			className="flex items-center justify-between px-4 py-3 border-b border-smoke 
                       border-dotted text-lg"
		>
			<p>{formatIsoDate(pendingFood.createdAt)}</p>
			<div className="flex flex-col items-center gap-0">
				<p
					style={{
						color: statusColor
					}}
					className="font-bold leading-tight"
				>
					{pendingFood.status}
				</p>
				{isReviewed(pendingFood.status) && (
					<button
						onClick={onViewReviewInfo}
						className="text-xs opacity-70 cursor-pointer"
					>
						See more
					</button>
				)}
			</div>
		</div>
	);
};

const Body = ({
	pendingFoodInformation: pendingFoodInformation
}: {
	pendingFoodInformation: FoodInformation<NutrientInFood>;
}) => {
	const foodBase = pendingFoodInformation.base;
	const foodNutrients = pendingFoodInformation.nutrients;
	const amountPerServing = getAmountPerServingView(foodBase);

	const nutrients = foodNutrients.filter((fn) => fn.nutrientData.base.type === "BASIC");
	const vitamins = foodNutrients.filter(
		(fn) => fn.nutrientData.base.type === "VITAMIN"
	);
	const minerals = foodNutrients.filter(
		(fn) => fn.nutrientData.base.type === "MINERAL"
	);

	return (
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
	);
};
