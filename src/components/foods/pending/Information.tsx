import { ActionButton } from "@/components/elements/ActionButton";
import { NutrientsSection } from "@/components/nutrients/NutrientsSection";
import { toPendingFoodReview } from "@/mappers/foodMappers";
import type {
	FoodInformation,
	PendingFood,
	PendingFoodReviewReq
} from "@/types/foodTypes";
import {
	getAmountPerServingFmt,
	getPendingFoodStatusUi,
	isReviewed
} from "@/utils/foodUtils";
import { formatIsoDate } from "@/utils/textUtils";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RejectionWriting } from "./RejectionWriting";
import { ReviewInformation } from "./ReviewInformation";

export const Information = ({
	pendingFood,
	onHandleReview,
	withUserId
}: {
	pendingFood: PendingFood;
	withUserId?: boolean;
	onHandleReview: (req: PendingFoodReviewReq) => void;
}) => {
	const [isRejecting, setIsRejecting] = useState<boolean>(false);
	const [isReviewInfoVisible, setIsReviewInfoVisible] = useState(false);

	function handleApprove() {
		onHandleReview({
			pendingFoodId: pendingFood.id,
			rejectionReason: null
		});
	}

	function handleReject(reason: string) {
		setIsRejecting(false);
		onHandleReview({
			pendingFoodId: pendingFood.id,
			rejectionReason: reason
		});
	}

	return (
		<div>
			<div className="flex flex-col w-90 bg-smoke/40 rounded-xl relative overflow-hidden">
				<Header
					pendingFood={pendingFood}
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
							onButtonClick={handleApprove}
						/>
						<ActionButton
							label="Reject"
							icon={X}
							bgColor="bg-rose-600"
							onButtonClick={() => setIsRejecting(true)}
						/>
					</div>
				)}

				{withUserId && (
					<p className="pb-4 px-4 text-center text-sm opacity-70">
						{pendingFood.createdBy}
					</p>
				)}

				{isReviewInfoVisible && (
					<ReviewInformation
						review={toPendingFoodReview(pendingFood)}
						onClose={() => setIsReviewInfoVisible(false)}
					/>
				)}

				{isRejecting && (
					<RejectionWriting
						onCancelRejection={() => setIsRejecting(false)}
						onReject={handleReject}
					/>
				)}
			</div>
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
	const { accentHex } = getPendingFoodStatusUi(pendingFood.status);

	return (
		<div
			className="flex items-center justify-between px-4 py-3 border-b border-smoke 
                       border-dotted text-lg"
		>
			<p>{formatIsoDate(pendingFood.createdAt)}</p>
			<div className="flex flex-col items-center">
				<p
					style={{
						color: accentHex
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
	pendingFoodInformation: FoodInformation;
}) => {
	const nameRef = useRef<HTMLParagraphElement>(null);
	const [isNameTruncated, setIsNameTruncated] = useState(false);
	const [isFullNameVisible, setIsFullNameVisible] = useState(false);

	const foodBase = pendingFoodInformation.base;
	const foodNutrients = pendingFoodInformation.nutrients;
	const amountPerServing = getAmountPerServingFmt(foodBase);

	function handleNameClick() {
		if (!isNameTruncated) return;
		setIsFullNameVisible((prev) => !prev);
	}

	useEffect(() => {
		const el = nameRef.current;
		if (el) {
			setIsNameTruncated(el.scrollWidth > el.clientWidth);
		}
	}, [pendingFoodInformation]);

	return (
		<div className="px-4 pt-3 pb-4 gap-2 flex flex-col">
			{/* Base Information */}
			<div className="text-lg leading-tight pb-2">
				<p
					ref={nameRef}
					onClick={handleNameClick}
					className={`${isNameTruncated ? "cursor-pointer" : ""}
                               ${isFullNameVisible ? "" : "truncate"}
                               font-semibold`}
				>
					{foodBase.name}
				</p>
				<p className="opacity-80 truncate">{foodBase.brand}</p>
				<p className="opacity-80">{amountPerServing}</p>
			</div>

			{/* Nutrients */}
			{foodNutrients.basic.length > 0 && 
                <NutrientsSection nutrientsInFood={foodNutrients.basic} />
            }
			{foodNutrients.vitamins.length > 0 && 
                <NutrientsSection nutrientsInFood={foodNutrients.vitamins} />
            }
			{foodNutrients.minerals.length > 0 && 
                <NutrientsSection nutrientsInFood={foodNutrients.minerals} />
            }
		</div>
	);
};
