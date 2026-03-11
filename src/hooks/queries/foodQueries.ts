import { apiClientApp } from "@/api/apiClient";
import { pagination, queryKeys } from "@/constants";
import type { AppQueryOptions } from "@/types/appTypes";
import type {
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes
} from "@/types/foodTypes";
import type { UserType } from "@/types/userTypes";
import type { ClientResponse } from "@/utils/clientUtils";
import { queryOptions, useQuery as rqUseQuery } from "@tanstack/react-query";

export const PendingFoodQueries = {
	ByUserId: {
		getOptions: (offset: number, userId: string) =>
			queryOptions({
				queryKey: queryKeys.food.pending.byUserId(offset, userId),
				queryFn: () =>
					apiClientApp.req<PendingFoodsByUserIdRes>({
						method: "GET",
						path: "/food/pending/find-by/user-id",
						params: {
							limit: `${pagination.limit}`,
							offset: `${offset}`,
							userId: userId
						}
					})
			}),
		use: (
			offset: number,
			userId: string,
			options?: AppQueryOptions<
				ClientResponse<PendingFoodsByUserIdRes>,
				ReturnType<typeof queryKeys.food.pending.byUserId>
			>
		) =>
			rqUseQuery({
				...PendingFoodQueries.ByUserId.getOptions(offset, userId),
				...options
			})
	},
	ByUserType: {
		getOptions: (offset: number, userType: UserType) =>
			queryOptions({
				queryKey: queryKeys.food.pending.byUserType(offset, userType),
				queryFn: () =>
					apiClientApp.req<PendingFoodsByUserTypeRes>({
						method: "GET",
						path: "/food/pending/find-by/user-type",
						params: {
							limit: `${pagination.limit}`,
							offset: `${offset}`,
							userType: userType
						}
					})
			}),
		use: (
			offset: number,
			userType: UserType,
			options?: AppQueryOptions<
				ClientResponse<PendingFoodsByUserIdRes>,
				ReturnType<typeof queryKeys.food.pending.byUserType>
			>
		) =>
			rqUseQuery({
				...PendingFoodQueries.ByUserType.getOptions(offset, userType),
				...options
			})
	}
};

export const getPendingFoodsByUserIdOptions = (offset: number, userId: string) =>
	queryOptions({
		queryKey: queryKeys.food.pending.byUserId(offset, userId),
		queryFn: () =>
			apiClientApp.req<PendingFoodsByUserIdRes>({
				method: "GET",
				path: "/food/pending/find-by/user-id",
				params: {
					limit: `${pagination.limit}`,
					offset: `${offset}`,
					userId: userId
				}
			})
	});
