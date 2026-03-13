import { useState } from "react";
import { UserIdSearch } from "@/components/app/home/UserIdSearch";
import type { UserScope as TUserScope } from "@/types/userTypes";
import { PendingFilters } from "./PendingFilters";
import { UserScope } from "./UserScope";
import type { PendingFoodStatus } from "@/types/foodTypes";

export function Home() {
	const [currentUserScope, setCurrentUserScope] = useState<TUserScope | null>(null);
	const [currentPendingFilter, setCurrentPendingFilter] =
		useState<PendingFoodStatus | null>(null);

	function handleUserScopeClick(scope: TUserScope) {
		if (scope === currentUserScope) {
			setCurrentUserScope(null);
		} else {
			setCurrentUserScope(scope);
		}
	}

	function handlePendingFilterClick(filter: PendingFoodStatus) {
		if (filter === currentPendingFilter) {
			setCurrentPendingFilter(null);
		} else {
			setCurrentPendingFilter(filter);
		}
	}

	return (
		<div className="min-h-screen bg-charcoal text-mist flex flex-col items-center pt-12">
			<div className="flex flex-col items-center gap-2 w-80">
				<div className="flex flex-col items-center gap-2">
					<UserScope
						currentScope={currentUserScope}
						onScopeSelection={handleUserScopeClick}
					/>
					<PendingFilters
						currentFilter={currentPendingFilter}
						onFilterSelection={handlePendingFilterClick}
					/>
				</div>
				<UserIdSearch
					isVisible={currentUserScope === "User ID"}
					currentPendingStatus={currentPendingFilter}
				/>
			</div>
		</div>
	);
}
