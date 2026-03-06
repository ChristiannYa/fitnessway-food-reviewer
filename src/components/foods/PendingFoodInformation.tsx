import type { FoodInformation, PendingFood } from "@/types/foodTypes";
import {
	getAmountPerServingView,
	getPendingFoodStatusColor,
	isReviewed
} from "@/utils/foodUtils";
import { formatIsoDate, isStringNullOrEmpty, uuidFirst } from "@/utils/textUtils";
import { NutrientsSection } from "../nutrients/NutrientsSection";
import { useState } from "react";
import { MoreHorizontal, Check, X } from "lucide-react";
import { ActionButton } from "@/components/elements/ActionButton";
import type { NutrientInFood } from "@/types/nutrientTypes";

export const PendingFoodInformation = ({ pendingFood }: { pendingFood: PendingFood }) => {
	const [isRejectionReasonVisible, setIsRejectionReasonVisible] =
		useState<boolean>(false);
	const [isRejecting, setIsRejecting] = useState<boolean>(false);
	const [rejectionReason, setRejectionReason] = useState<string>("");

	return (
		<div className="flex flex-col w-90 bg-smoke/40 rounded-xl relative overflow-hidden">
			{/* Header Bar */}
			<PendingFoodHeader
				pendingFood={pendingFood}
				onViewRejectionReason={() => setIsRejectionReasonVisible(true)}
			/>

			{/* Body */}
			<PendingFoodBody pendingFoodInformation={pendingFood.information} />

			{/* Handle Review Buttons */}
			{!isRejecting && (
				<div className="flex w-full pb-4 px-4 gap-2">
					<ActionButton
						label="Accept"
						icon={Check}
						bgColor="bg-dry-green"
						onButtonClick={() => {}}
					/>
					<ActionButton
						label="Reject"
						icon={X}
						bgColor="bg-rose-600"
						onButtonClick={() => setIsRejecting(true)}
					/>
				</div>
			)}

			{pendingFood.rejectionReason && isRejectionReasonVisible && (
				<RejectionReason
					reason={pendingFood.rejectionReason}
					onClose={() => setIsRejectionReasonVisible(false)}
				/>
			)}

			{isRejecting && (
				<RejectionWriting
					onCancelRejection={() => setIsRejecting(false)}
					onReject={() => {}}
				/>
			)}
		</div>
	);
};

const PendingFoodHeader = ({
	pendingFood,
	onViewRejectionReason
}: {
	pendingFood: PendingFood;
	onViewRejectionReason: () => void;
}) => {
	return (
		<div
			className="flex items-center justify-between px-4 py-3 border-b border-smoke 
                       border-dotted text-lg"
		>
			<p>{formatIsoDate(pendingFood.createdAt)}</p>
			<div className="flex flex-col items-center gap-0">
				<p
					className={`${getPendingFoodStatusColor(pendingFood.status)} font-bold 
                                leading-tight`}
				>
					{pendingFood.status}
				</p>
				{isReviewed(pendingFood.status) && (
					<p className="text-xs leading-tight">
						{uuidFirst(pendingFood.reviewedBy ?? "")}
					</p>
				)}
				{pendingFood.rejectionReason && (
					<MoreHorizontal
						onClick={onViewRejectionReason}
						size={24}
						style={{
							padding: 2,
							cursor: "pointer"
						}}
					/>
				)}
			</div>
		</div>
	);
};

const PendingFoodBody = ({
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

const RejectionReason = ({
	reason,
	onClose
}: {
	reason: string;
	onClose: () => void;
}) => {
	return (
		<div
			onClick={onClose}
			className="flex flex-col items-center gap-2 w-full h-full p-3 mx-auto absolute  
                     bg-mist/10 rounded-md backdrop-blur-md overflow-auto no-scrollbar z-20"
		>
			<h2 className="text-lg font-medium leading-tight">Rejection Reason</h2>
			<p className="text-center">{reason}</p>
		</div>
	);
};

const RejectionWriting = ({
	onCancelRejection,
	onReject
}: {
	onCancelRejection: () => void;
	onReject: () => void;
}) => {
	const [hasClickedRejected, setHasClickedRejected] = useState<boolean>(false);
	const [rejectionConfirmed, setRejectionConfitmed] = useState<boolean>(false);
	const [rejectionReason, setRejectionreason] = useState<string>("");

	function handleRejection() {
		if (!rejectionConfirmed) return;
		onReject();
	}

	return (
		<div className="flex flex-col p-3 w-full h-full absolute bg-black/50 backdrop-blur-lg">
			<div className="grow my-4 w-full relative bg-smoke/40 border border-smoke rounded-lg">
				{!hasClickedRejected ? (
					<textarea
						value={rejectionReason}
						onChange={(e) => setRejectionreason(e.target.value)}
						placeholder="Rejection reason..."
						className="w-full h-full p-4 focus:outline-none focus:ring-1 focus:ring-mist 
                                   rounded-lg resize-none"
					/>
				) : (
					<div
						className="absolute top-0 left-0 px-2 w-full h-full flex flex-col justify-center 
                                    items-center gap-8"
					>
						<p>Reject?</p>
						<div className="flex w-full gap-2 pb-1">
							<ActionButton
								label="No"
								onButtonClick={() => setHasClickedRejected(false)}
							/>
							<ActionButton
								label="Yes"
								bgColor="bg-rose-600"
								onButtonClick={handleRejection}
							/>
						</div>
					</div>
				)}
			</div>
			{!hasClickedRejected && (
				<div className="flex w-full gap-2 pb-1">
					<ActionButton label="Cancel" onButtonClick={onCancelRejection} />
					<ActionButton
						label="Reject"
						bgColor="bg-rose-600"
						disabled={isStringNullOrEmpty(rejectionReason)}
						onButtonClick={() => setHasClickedRejected(true)}
					/>
				</div>
			)}
		</div>
	);
};
