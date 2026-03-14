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
			<div className="grid md:grid-cols-2 grid-cols-1 w-full md:w-160 max-w-full gap-2">
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
