import type { PendingFoodReview } from "@/types/foodTypes";
import { getPendingFoodStatusUi } from "@/utils/foodUtils";
import { formatIsoDate } from "@/utils/textUtils";
import { Minus } from "lucide-react";

export const ReviewInformation = ({
	review,
	onClose
}: {
	review: PendingFoodReview;
	onClose: () => void;
}) => {
	const { accentHex } = getPendingFoodStatusUi(review.status);

	return (
		<div
			style={{ border: `solid 2px ${accentHex}80`, borderRadius: 12 }}
			className="w-full h-full absolute py-2 bg-black/60 backdrop-blur-md"
		>
			<div className="flex flex-col gap-4 px-4 relative h-full">
				<button
					onClick={onClose}
					className="flex justify-center items-center absolute right-2 
                               w-5 h-5 rounded-full bg-dry-green cursor-pointer"
				>
					<Minus size={12} strokeWidth={4} />
				</button>

				{/* Header */}
				<div className="text-center shrink-0">
					<h2 className="text-lg font-bold">Review Date</h2>
					{review.reviewedAt && <p>{formatIsoDate(review.reviewedAt)}</p>}
				</div>

				{/* Reasoning if present */}
				{review.rejectionReason && (
					<div className="flex flex-col min-h-0 grow">
						<h2 className="font-medium shrink-0">Reason</h2>
						<p className="opacity-70 overflow-y-auto no-scrollbar">
							{review.rejectionReason}
						</p>
					</div>
				)}

				<div className="grow flex justify-center items-end">
					<p className="text-xs text-center opacity-70">{review.reviewedBy}</p>
				</div>
			</div>
		</div>
	);
};
