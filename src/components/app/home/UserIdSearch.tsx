import { PendingFoodQueries } from "@/hooks/queries/foodQueries";
import { isStringNullOrEmpty } from "@/utils/textUtils";
import { useState } from "react";
import { Spinner } from "@/components/elements/Spinner";
import { useAutoClear } from "@/hooks/useAutoClear";
import { PendingFoodsSummaryGrid } from "@/components/foods/PendingFoodsSummaryGrid";
import { AvailablePages } from "@/components/elements/AvailablePages";
import { pagination } from "@/constants";
import { useReviewMutation } from "@/hooks/mutations/foodMutations";
import type { ReviewPendingFoodReq } from "@/types/foodTypes";

export const UserIdSearch = ({ isVisible }: { isVisible: boolean }) => {
	const [hasSearched, setHasSearched] = useState(false);
	const [offset, setOffset] = useState(0);
	const [userIdQueryParam, setUserIdQueryParam] = useState("");

	const {
		isError: pfByUserIdQuError,
		isPending: pfByUserIdQuPending,
		data: pfByUserIdQuData,
		refetch: pfByUserIdQuRefetch
	} = PendingFoodQueries.ByUserId.use(offset, userIdQueryParam, {
		enabled: hasSearched
	});

	const reviewMutation = useReviewMutation({
		offset,
		searchType: "User ID",
		userId: userIdQueryParam
	});

	const isDataLoading = pfByUserIdQuPending && hasSearched;

	const searchFailed = (() => {
		const apiError = pfByUserIdQuData && !pfByUserIdQuData.success;
		return hasSearched && !isDataLoading && (pfByUserIdQuError || !!apiError);
	})();

	useAutoClear(searchFailed, () => setHasSearched(false));

	const queryData = pfByUserIdQuData?.data?.pendingFoodsPagination;

	function handleSearch() {
		setHasSearched(true);
		if (queryData || searchFailed) pfByUserIdQuRefetch();
	}

	function handlePageChange(page: number) {
		setOffset((page - 1) * pagination.limit);
	}

	function handleReview(req: ReviewPendingFoodReq) {
		reviewMutation.mutate(req);
	}

	if (!isVisible) return null;

	return (
		<div className="flex flex-col gap-2">
			{searchFailed && (
				<p className="text-red-500 text-center">
					Error fetching foods by User ID
				</p>
			)}

			<div className="flex flex-col mx-auto gap-2 w-96">
				<input
					type="text"
					name="user_id"
					id="user_id"
					placeholder="User ID"
					value={userIdQueryParam}
					onChange={(e) => setUserIdQueryParam(e.target.value)}
					className="px-3 py-2 text-center border border-smoke focus:ring-1 focus:ring-mist 
                           focus:outline-0"
				/>

				<button
					onClick={handleSearch}
					disabled={isStringNullOrEmpty(userIdQueryParam)}
					className="py-2 rounded-md bg-smoke text-mist disabled:opacity-50 
                               transition-colors"
				>
					Search
				</button>
			</div>

			{isDataLoading && (
				<div className="mx-auto">
					<Spinner size={16} />
				</div>
			)}

			{queryData && (
				<>
					<AvailablePages
						pageCount={queryData.pageCount}
						currentPage={queryData.currentPage}
						handlePageChange={(page) => handlePageChange(page)}
					/>
					<PendingFoodsSummaryGrid
						pendingFoods={queryData.data}
						onAccept={(foodId) => handleReview({ pendingFoodId: foodId })}
						onReject={(foodId, reason) =>
							handleReview({
								pendingFoodId: foodId,
								rejectionReason: reason
							})
						}
					/>
				</>
			)}
		</div>
	);
};
