import { useState } from "react";
import { UserIdSearch } from "@/components/app/home/UserIdSearch";
import type { UserScope as TUserScope } from "@/types/userTypes";
import { StatusFilters } from "./StatusFilters";
import { UserScope } from "./UserScope";
import type { PendingFoodStatus } from "@/types/foodTypes";

export const Home = () => {
	const [currentUserScope, setCurrentUserScope] = useState<TUserScope | null>(null);
	const [currentStatusFilter, setCurrentStatusFilter] =
		useState<PendingFoodStatus | null>(null);

	function handleUserScopeClick(scope: TUserScope) {
		setCurrentUserScope(scope === currentUserScope ? null : scope);
	}

	function handleStatusFilterClick(filter: PendingFoodStatus) {
		setCurrentStatusFilter(filter === currentStatusFilter ? null : filter);
	}

	return (
		<div className="min-h-screen bg-charcoal text-mist flex flex-col items-center pt-12">
			<div className="flex flex-col items-center gap-2 w-80">
				<div className="flex flex-col items-center gap-2">
					<UserScope
						currentScope={currentUserScope}
						onScopeSelection={handleUserScopeClick}
					/>
					<StatusFilters
						currentStatus={currentStatusFilter}
						onStatusSelection={handleStatusFilterClick}
					/>
				</div>
				<UserIdSearch
					isVisible={currentUserScope === "User ID"}
					currentPendingStatus={currentStatusFilter}
				/>
			</div>
		</div>
	);
};
