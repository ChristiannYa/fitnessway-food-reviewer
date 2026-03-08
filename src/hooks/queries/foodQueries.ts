import { apiClientApp } from "@/api/apiClient";
import type { ClientResponse } from "@/api/apiClient";
import { pagination, queryKeys } from "@/constants";
import type { ClientQueryOptions } from "@/types/appTypes";
import type {
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes
} from "@/types/foodTypes";
import { useQuery } from "@tanstack/react-query";

export const usePendingFoodsByUserIdQuery = (
	offset: number,
	userId: string,
	options?: ClientQueryOptions<ClientResponse<PendingFoodsByUserTypeRes>>
) =>
	useQuery({
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
			}),
		...options
	});

export const usePendingFoodsByuserTypeQuery = (
	offset: number,
	userType: string,
	options?: ClientQueryOptions<ClientResponse<PendingFoodsByUserIdRes>>
) =>
	useQuery({
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
			}),
		...options
	});
