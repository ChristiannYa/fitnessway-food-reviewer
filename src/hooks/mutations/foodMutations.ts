import { apiClientApp } from "@/api/apiClient";
import { mutationKeys, queryKeys } from "@/constants";
import type { ReviewPendingFoodReq, ReviewPendingFoodRes } from "@/types/foodTypes";
import type { SearchOptions, UserType } from "@/types/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ReviewMutation = { offset: number; req: ReviewPendingFoodReq } & (
	| { searchType: Extract<SearchOptions, "User ID">; userId: string }
	| { searchType: Extract<SearchOptions, "User Type">; userType: UserType }
);

export const useReviewMutation = () => {
    const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ req }: ReviewMutation) =>
			apiClientApp.req<ReviewPendingFoodRes>({
				method: "POST",
				path: "/food/pending/review",
				body: req
			}),
		onMutate: async (ctx) => {
			switch (ctx.searchType) {
				case "User Type": {
					const snapshot = queryClient.getQueryData(
						queryKeys.food.pending.byUserType(ctx.offset, ctx.userType)
					);
                    
					break;
				}
				case "User ID": {
					const snapshot = queryClient.getQueryData(
						queryKeys.food.pending.byUserId(ctx.offset, ctx.userId)
					);
					break;
				}
			}
		},
		mutationKey: [mutationKeys.food.pending.review()]
	});
};
