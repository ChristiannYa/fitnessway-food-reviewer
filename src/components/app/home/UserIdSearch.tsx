import { PendingFoodQueries } from "@/hooks/queries/foodQueries";
import { isStringNullOrEmpty } from "@/utils/textUtils";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/elements/Spinner";
import { Grid } from "@/components/foods/pending/Grid";
import { AvailablePages } from "@/components/elements/AvailablePages";
import { pagination } from "@/constants";
import { useReviewMutation } from "@/hooks/mutations/foodMutations";
import type { PendingFoodReviewReq } from "@/types/foodTypes";
import { useQueryClient } from "@tanstack/react-query";

export const UserIdSearch = ({ isVisible }: { isVisible: boolean }) => {
	const [offset, setOffset] = useState(0);
	const [userIdInput, setUserIdInput] = useState("");
	const [userIdSearched, setUserIdSearched] = useState("");

	const {
		isError: pfResError,
		isFetching: pfFetching,
		data: pfData,
		refetch: pfRefetch
	} = PendingFoodQueries.ByUserId.use(offset, userIdSearched, {
		enabled: false
	});

	const reviewMutation = useReviewMutation({
		offset,
		searchType: "User ID",
		userId: userIdSearched
	});

	const searchFailed = (() => {
		const apiError = pfData && !pfData.success;
		return !pfFetching && (pfResError || !!apiError);
	})();

	const queryData = pfData?.data?.pendingFoodsPagination;

	function handleSearch() {
		setOffset(0);
		setUserIdSearched(userIdInput);
	}

	function handlePageChange(page: number) {
		setOffset((page - 1) * pagination.limit);
	}

	function handleReview(req: PendingFoodReviewReq) {
		reviewMutation.mutate(req);
	}

	useSearch(userIdSearched, offset, pfRefetch);

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
					value={userIdInput}
					onChange={(e) => setUserIdInput(e.target.value)}
					className="px-3 py-2 text-center border border-smoke focus:ring-1 focus:ring-mist 
                               focus:outline-0"
				/>

				<button
					onClick={handleSearch}
					disabled={isStringNullOrEmpty(userIdInput)}
					className="py-2 rounded-md bg-smoke text-mist disabled:opacity-50 
                               transition-colors"
				>
					Search
				</button>
			</div>

			{pfFetching && (
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
					<Grid
						pendingFoods={queryData.data}
						onApprove={(foodId) =>
							handleReview({
								pendingFoodId: foodId,
								rejectionReason: null
							})
						}
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

/**
 * Triggers a fetch if `userIdSearched` or `offset` change as long as the data is
 * not already cached.
 *
 * @param userIdSearched - The user ID to search for. No fetch is triggered if invalid.
 * @param offset - The pagination offset.
 * @param refetchFn - The function to call when a fetch is needed.
 */
function useSearch(userIdSearched: string, offset: number, refetchFn: () => void) {
	const queryClient = useQueryClient();

	useEffect(() => {
		// Guard that helps to avoid making a server call on initial mount when
		// there is no user id set to search
		if (isStringNullOrEmpty(userIdSearched)) return;

		const pfCache = queryClient.getQueryData(
			PendingFoodQueries.ByUserId.getOptions(offset, userIdSearched).queryKey
		);
		if (pfCache) return;

		refetchFn();
	}, [userIdSearched, offset]);
}
