import { mutationKeys } from "@/constants";
import type { PendingFoodReviewReq } from "@/types/foodTypes";
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
		mutationFn: (req: PendingFoodReviewReq) => {
			/*
			apiClientApp.req<ReviewPendingFoodRes>({
				method: "PUT",
				path: "/food/pending/review",
				body: req
			}),
            */

			console.log("mutation blocked, req: ", req);
			return;
		},
		onMutate: async () => {
			switch (state.searchType) {
				case "User Type": {
					const snapshot = queryClient.getQueryData(
						PendingFoodQueries.ByUserType.getOptions(
							state.offset,
							state.userType
						).queryKey
					);

					if (!snapshot) {
						console.log("no pending foods by user type cache found");
						return;
					}

					if (snapshot.data === null) {
						console.log("pending foods by user type not available");
						return;
					}

					const pendingFoods = snapshot.data.pendingFoodsPagination.data;

					pendingFoods.map((food) => {
						console.log("food id: ", food.id);
					});

					break;
				}
				case "User ID": {
					const snapshot = queryClient.getQueryData(
						PendingFoodQueries.ByUserId.getOptions(state.offset, state.userId)
							.queryKey
					);

					if (!snapshot) {
						console.log("no pending foods by user id cache found");
						return;
					}

					if (snapshot.data === null) {
						console.log("pending foods by user id not available");
						return;
					}

					const pendingFoods = snapshot.data.pendingFoodsPagination.data;

					pendingFoods.map((food) => {
						console.log("food id: ", food.id);
					});

					break;
				}
			}
		},
		mutationKey: [mutationKeys.food.pending.review()]
	});
};
