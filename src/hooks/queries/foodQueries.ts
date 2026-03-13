import { apiClientApp } from "@/api/apiClient";
import { pagination, queryKeys } from "@/constants";
import type { AppQueryOptions } from "@/types/appTypes";
import type {
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes,
	PendingFoodsReqParams
} from "@/types/foodTypes";
import type { UserType } from "@/types/userTypes";
import type { ClientResponse } from "@/utils/clientUtils";
import { queryOptions, useQuery as rqUseQuery } from "@tanstack/react-query";

export const PendingFoodQueries = {
	ByUserId: {
		getOptions: (params: PendingFoodsReqParams<{ userId: string }>) =>
			queryOptions({
				queryKey: queryKeys.food.pending.byUserId(params),
				queryFn: () =>
					apiClientApp.req<PendingFoodsByUserIdRes>({
						method: "GET",
						path: "/food/pending/find-by/user-id",
						params: {
							limit: `${pagination.limit}`,
							offset: `${params.offset}`,
							userId: params.userId,
							...(params.status && { pendingStatus: params.status })
						}
					})
			}),
		use: (
			params: PendingFoodsReqParams<{ userId: string }>,
			options?: AppQueryOptions<
				ClientResponse<PendingFoodsByUserIdRes>,
				ReturnType<typeof queryKeys.food.pending.byUserId>
			>
		) =>
			rqUseQuery({
				...PendingFoodQueries.ByUserId.getOptions(params),
				...options
			})
	},
	ByUserType: {
		getOptions: (params: PendingFoodsReqParams<{ userType: UserType }>) =>
			queryOptions({
				queryKey: queryKeys.food.pending.byUserType(params),
				queryFn: () =>
					apiClientApp.req<PendingFoodsByUserTypeRes>({
						method: "GET",
						path: "/food/pending/find-by/user-type",
						params: {
							limit: `${pagination.limit}`,
							offset: `${params.offset}`,
							userType: params.userType,
							...(params.status && { pendingStatus: params.status })
						}
					})
			}),
		use: (
			params: PendingFoodsReqParams<{ userType: UserType }>,
			options?: AppQueryOptions<
				ClientResponse<PendingFoodsByUserIdRes>,
				ReturnType<typeof queryKeys.food.pending.byUserType>
			>
		) =>
			rqUseQuery({
				...PendingFoodQueries.ByUserType.getOptions(params),
				...options
			})
	}
};
