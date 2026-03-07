import { apiClientApp } from "@/api/apiClient";
import { mutationKeys, queryKeys } from "@/constants";
import type { ReviewPendingFoodReq, ReviewPendingFoodRes } from "@/types/foodTypes";
import type { UserType } from "@/types/userTypes";
import { useMutation } from "@tanstack/react-query";

type ReviewMutation = {
    offset: number;
    userId?: string;
    userType?: UserType
}

export const reviewMutation = useMutation({
	mutationFn: ( { offset, userId, userType: usertType, ...req }: ReviewPendingFoodReq & ReviewMutation) =>
		apiClientApp.req<ReviewPendingFoodRes>({
			method: "POST",
			path: "/food/pending/review",
			body: req
		}),
	onMutate: async (req, ctx) => {
        if (req.userId) {
            const previousPendingFoods = ctx.client.getQueryData(
                queryKeys.food.pending.byUserId(req.offset, req.userId)
            );
        } else if(req.userType) {
            const previousPendingFoods = ctx.client.getQueryData(
                queryKeys.food.pending.byUserType(req.offset, req.userType)
            )
        }
	},
	mutationKey: [mutationKeys.food.pending.review()]
});
