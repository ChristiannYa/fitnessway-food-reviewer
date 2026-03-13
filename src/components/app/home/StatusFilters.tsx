import { PENDING_FOOD_STATUS } from "@/types/foodTypes";
import type { PendingFoodStatus } from "@/types/foodTypes";
import { getPendingFoodStatusUi } from "@/utils/foodUtils";

export const StatusFilters = ({
	currentStatus,
	onStatusSelection
}: {
	currentStatus: PendingFoodStatus | null;
	onStatusSelection: (filter: PendingFoodStatus) => void;
}) => {
	return (
		<div className="flex gap-2 w-fit">
			{Object.values(PENDING_FOOD_STATUS).map((status) => {
				const { Icon, accentHex } = getPendingFoodStatusUi(status);
				const isSelected = currentStatus === status;

				return (
					<button
						key={status}
						onClick={() => onStatusSelection(status)}
						className="p-1.5 rounded-full cursor-pointer"
					>
						<Icon
							size={26}
							color={isSelected ? accentHex : `${accentHex}50`}
						/>
					</button>
				);
			})}
		</div>
	);
};
