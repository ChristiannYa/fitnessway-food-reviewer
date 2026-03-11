import { apiClientApp } from "@/api/apiClient";
import { mutationKeys } from "@/constants";
import type { ReviewPendingFoodReq, ReviewPendingFoodRes } from "@/types/foodTypes";
import type { SearchOptions, UserType } from "@/types/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PendingFoodQueries } from "../queries/foodQueries";

type ReviewMutationState = { offset: number } & (
	| { searchType: Extract<SearchOptions, "User ID">; userId: string }
	| { searchType: Extract<SearchOptions, "User Type">; userType: UserType }
);

export const useReviewMutation = (state: ReviewMutationState) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (req: ReviewPendingFoodReq) =>
			apiClientApp.req<ReviewPendingFoodRes>({
				method: "POST",
				path: "/food/pending/review",
				body: req
			}),
		onMutate: async () => {
			switch (state.searchType) {
				case "User Type": {
					const snapshot = queryClient.getQueryData(
						PendingFoodQueries.ByUserType.getOptions(
							state.offset,
							state.userType
						).queryKey
					);

					break;
				}
				case "User ID": {
					const snapshot = queryClient.getQueryData(
						PendingFoodQueries.ByUserId.getOptions(state.offset, state.userId)
							.queryKey
					);

					break;
				}
			}
		},
		mutationKey: [mutationKeys.food.pending.review()]
	});
};
