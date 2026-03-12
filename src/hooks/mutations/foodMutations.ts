import { mutationKeys } from "@/constants";
import type {
	PendingFoodReviewReq,
	PendingFoodReviewRes,
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes
} from "@/types/foodTypes";
import type { SearchOptions, UserType } from "@/types/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PendingFoodQueries } from "../queries/foodQueries";
import { produce } from "immer";
import { useUserQuery } from "../queries/userQueries";
import type { ClientResponse } from "@/utils/clientUtils";
import { apiClientApp } from "@/api/apiClient";

type ReviewMutationState = { offset: number } & (
	| { searchType: Extract<SearchOptions, "User ID">; userId: string }
	| { searchType: Extract<SearchOptions, "User Type">; userType: UserType }
);

export const useReviewMutation = (state: ReviewMutationState) => {
	const queryClient = useQueryClient();
	const { data: uResData } = useUserQuery();

	const reviewer = uResData?.data?.user;

	return useMutation<
		ClientResponse<PendingFoodReviewRes>, // TData - mutationFn return
		Error, // TError
		PendingFoodReviewReq, // TVariables
		{
			snapshot:
				| ClientResponse<PendingFoodsByUserIdRes | PendingFoodsByUserTypeRes>
				| undefined;
		} // TContext
	>({
		mutationFn: (req: PendingFoodReviewReq) =>
			apiClientApp.req<PendingFoodReviewRes>({
				method: "PUT",
				path: "/food/pending/review",
				body: req
			}),
		onMutate: async (ctx) => {
			switch (state.searchType) {
				case "User Type": {
					return { snapshot: undefined };
				}
				case "User ID": {
					const queryOptions = PendingFoodQueries.ByUserId.getOptions(
						state.offset,
						state.userId
					);

					const snapshot = queryClient.getQueryData(queryOptions.queryKey);

					queryClient.setQueryData(
						queryOptions.queryKey,
						produce<typeof snapshot>((draft) => {
							if (!draft?.data || !reviewer) return;

							const food = draft.data.pendingFoodsPagination.data.find(
								(f) => f.id === ctx.pendingFoodId
							);
							if (!food) return;

							const isAccepted = ctx.rejectionReason === null;

							food.status = isAccepted ? "APPROVED" : "REJECTED";
							food.reviewedBy = reviewer.id;
							food.reviewedAt = new Date().toISOString();
							food.rejectionReason = ctx.rejectionReason ?? undefined;
						})
					);

					return { snapshot };
				}
			}
		},
		onError: (err, _, ctx) => {
			console.log("review mutation error: ", err.message);

			if (!ctx?.snapshot) return;

			switch (state.searchType) {
				case "User Type": {
					const queryOptions = PendingFoodQueries.ByUserType.getOptions(
						state.offset,
						state.userType
					);

					queryClient.setQueryData(queryOptions.queryKey, ctx.snapshot);

					return;
				}
				case "User ID": {
					const queryOptions = PendingFoodQueries.ByUserId.getOptions(
						state.offset,
						state.userId
					);

					queryClient.setQueryData(queryOptions.queryKey, ctx.snapshot);

					return;
				}
			}
		},
		mutationKey: [mutationKeys.food.pending.review()]
	});
};
