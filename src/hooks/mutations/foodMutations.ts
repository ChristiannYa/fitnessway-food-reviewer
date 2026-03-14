import { mutationKeys } from "@/constants";
import type { queryKeys } from "@/constants";
import type {
	PendingFood,
	PendingFoodReviewReq,
	PendingFoodReviewRes,
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes,
	PendingFoodStatus
} from "@/types/foodTypes";
import type { UserScope, UserType } from "@/types/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PendingFoodQueries } from "../queries/foodQueries";
import { produce } from "immer";
import { useUserQuery } from "../queries/userQueries";
import type { ClientResponse } from "@/utils/clientUtils";
import { apiClientApp } from "@/api/apiClient";

type ReviewMutationState = { offset: number; status?: PendingFoodStatus } & (
	| { searchType: Extract<UserScope, "User ID">; userId: string }
	| { searchType: Extract<UserScope, "User Type">; userType: UserType }
);

type SnapshotCtx =
	| ClientResponse<PendingFoodsByUserIdRes | PendingFoodsByUserTypeRes>
	| undefined;

type QueryKeyByStatusCtx =
	| (ReturnType<typeof queryKeys.food.pending.byUserId> | undefined)
	| (ReturnType<typeof queryKeys.food.pending.byUserType> | undefined);

export const useReviewMutation = (
	state: ReviewMutationState,
	onOptUpdate: (optReview: PendingFood) => void
) => {
	const queryClient = useQueryClient();
	const { data: uResData } = useUserQuery();

	const reviewer = uResData?.data?.user;

	return useMutation<
		ClientResponse<PendingFoodReviewRes>, // TData - mutationFn return
		Error, // TError
		PendingFoodReviewReq, // TVariables
		{
			snapshot: SnapshotCtx;
			snapshotByStatus: SnapshotCtx;
			queryKeyByStatus: QueryKeyByStatusCtx;
		} // TContext
	>({
		mutationFn: (req: PendingFoodReviewReq) => {
			return apiClientApp.req<PendingFoodReviewRes>({
				method: "PUT",
				path: "/food/pending/review",
				body: req
			});
		},
		onMutate: async (ctx) => {
			switch (state.searchType) {
				case "User Type": {
					const { searchType, ...params } = state;

					const queryOptions = PendingFoodQueries.ByUserType.getOptions(params);
					const snapshot = queryClient.getQueryData(queryOptions.queryKey);

					// Remove from current status cache
					queryClient.setQueryData(
						queryOptions.queryKey,
						produce(snapshot, (draft) => {
							if (!draft?.data) return;
							const pagination = draft.data.pendingFoodsPagination;
							pagination.data = pagination.data.filter(
								(f) => f.id !== ctx.pendingFoodId
							);
						})
					);

					const isAccepted = ctx.rejectionReason === null;
					const status: PendingFoodStatus = isAccepted
						? "APPROVED"
						: "REJECTED";

					// Build optimistic review
					const optReview = produce(
						snapshot?.data?.pendingFoodsPagination.data.find(
							(f) => f.id === ctx.pendingFoodId
						),
						(draft) => {
							if (!draft || !reviewer) return;

							draft.status = status;
							draft.reviewedBy = reviewer.id;
							draft.reviewedAt = new Date().toISOString();
							draft.rejectionReason = ctx.rejectionReason ?? undefined;
						}
					);

					const queryOptionsByStatus = PendingFoodQueries.ByUserType.getOptions(
						{
							...params,
							status
						}
					);
					const snapshotByStatus = queryClient.getQueryData(
						queryOptionsByStatus.queryKey
					);

					// Add to status cache (only if its ached)
					if (snapshotByStatus && optReview) {
						queryClient.setQueryData(
							queryOptionsByStatus.queryKey,
							produce(snapshotByStatus, (draft) => {
								if (!draft.data) return;
								draft.data.pendingFoodsPagination.data.push(optReview);
							})
						);
					}

					if (optReview) onOptUpdate(optReview);

					return {
						snapshot,
						snapshotByStatus,
						queryKeyByStatus: queryOptionsByStatus.queryKey
					};
				}
				case "User ID": {
					const { searchType, ...params } = state;

					const queryOptions = PendingFoodQueries.ByUserId.getOptions(params);
					const snapshot = queryClient.getQueryData(queryOptions.queryKey);

					// Remove review from current status cache
					queryClient.setQueryData(
						queryOptions.queryKey,
						produce(snapshot, (draft) => {
							if (!draft?.data) return;
							const pagination = draft.data.pendingFoodsPagination;
							pagination.data = pagination.data.filter(
								(f) => f.id !== ctx.pendingFoodId
							);
						})
					);

					const isAccepted = ctx.rejectionReason === null;
					const status: PendingFoodStatus = isAccepted
						? "APPROVED"
						: "REJECTED";

					// Build optimistic review
					const optReview = produce(
						snapshot?.data?.pendingFoodsPagination.data.find(
							(f) => f.id === ctx.pendingFoodId
						),
						(draft) => {
							if (!draft || !reviewer) return;

							draft.status = status;
							draft.reviewedBy = reviewer.id;
							draft.reviewedAt = new Date().toISOString();
							draft.rejectionReason = ctx.rejectionReason ?? undefined;
						}
					);

					const queryOptionsByStatus = PendingFoodQueries.ByUserId.getOptions({
						...params,
						status
					});
					const snapshotByStatus = queryClient.getQueryData(
						queryOptionsByStatus.queryKey
					);

					// Add to status cache (only if it's cached)
					if (snapshotByStatus && optReview) {
						queryClient.setQueryData(
							queryOptionsByStatus.queryKey,
							produce(snapshotByStatus, (draft) => {
								if (!draft.data) return;
								draft.data.pendingFoodsPagination.data.push(optReview);
							})
						);
					}

					if (optReview) onOptUpdate(optReview);

					return {
						snapshot,
						snapshotByStatus,
						queryKeyByStatus: queryOptionsByStatus.queryKey
					};
				}
			}
		},
		onError: (err, _, ctx) => {
			console.log("review mutation error: ", err.message);
			if (!ctx?.snapshot) return;

			switch (state.searchType) {
				case "User Type": {
					const { searchType, ...params } = state;
					const queryOptions = PendingFoodQueries.ByUserType.getOptions(params);

					queryClient.setQueryData(queryOptions.queryKey, ctx.snapshot);

					if (ctx.queryKeyByStatus) {
						queryClient.setQueryData(
							ctx.queryKeyByStatus,
							ctx.snapshotByStatus
						);
					}
					return;
				}
				case "User ID": {
					const { searchType, ...params } = state;
					const queryOptions = PendingFoodQueries.ByUserId.getOptions(params);

					queryClient.setQueryData(queryOptions.queryKey, ctx.snapshot);

					if (ctx.queryKeyByStatus) {
						queryClient.setQueryData(
							ctx.queryKeyByStatus,
							ctx.snapshotByStatus
						);
					}

					return;
				}
			}
		},
		mutationKey: [mutationKeys.food.pending.review()]
	});
};
