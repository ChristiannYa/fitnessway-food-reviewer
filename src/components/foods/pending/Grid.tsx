import type { PendingFood } from "@/types/foodTypes";
import { Summary } from "./Summary";

export const Grid = ({
	pendingFoods,
	onFoodClick,
	withUserId = false
}: {
	pendingFoods: PendingFood[];
	onFoodClick: (food: PendingFood) => void;
	withUserId?: boolean;
}) => {
	if (pendingFoods.length === 0) {
		return <p className="text-center">No foods available</p>;
	}

	return (
		<>
			<div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full md:w-152 
                           lg:w-230 max-w-full gap-2"
			>
				{pendingFoods.map((pendingFood) => {
					return (
						<div key={pendingFood.id}>
							<Summary
								pendingFood={pendingFood}
								onFoodClick={onFoodClick}
								withUserId={withUserId}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
};
