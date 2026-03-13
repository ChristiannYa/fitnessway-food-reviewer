import { PENDING_FOOD_STATUS } from "@/types/foodTypes";
import type { PendingFoodStatus } from "@/types/foodTypes";
import { Ban, CircleCheckBig, Clock12 } from "lucide-react";

export const PendingFilters = ({
	currentFilter,
	onFilterSelection
}: {
	currentFilter: PendingFoodStatus | null;
	onFilterSelection: (filter: PendingFoodStatus) => void;
}) => {
	return (
		<div className="flex gap-2 w-fit">
			{Object.values(PENDING_FOOD_STATUS).map((status) => {
				const Icon = (() => {
					switch (status) {
						case "PENDING": {
							return Clock12;
						}
						case "APPROVED": {
							return CircleCheckBig;
						}
						case "REJECTED": {
							return Ban;
						}
					}
				})();

				const isSelected = currentFilter === status;

				return (
					<button
						key={status}
						onClick={() => onFilterSelection(status)}
						className={`p-1.5 rounded-full cursor-pointer ${isSelected ? "bg-smoke" : ""}`}
					>
						<Icon size={24} />
					</button>
				);
			})}
		</div>
	);
};
