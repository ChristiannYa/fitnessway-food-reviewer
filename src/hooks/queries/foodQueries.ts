import { apiClientApp } from "@/api/apiClient";
import type { ClientResponse } from "@/api/apiClient";
import { PAGINATION_LIMIT } from "@/constants";
import type { TokenGuardQueryOptions } from "@/hooks/useTokenGuardQuery";
import { useTokenGuardQuery } from "@/hooks/useTokenGuardQuery";
import type {
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes
} from "@/types/foodTypes";

export const usePendingFoodsByUserIdQuery = (
	offset: number,
	userId: string,
	options?: TokenGuardQueryOptions<ClientResponse<PendingFoodsByUserIdRes>>
) =>
	useTokenGuardQuery({
		queryKey: [`pendingFoodsByUserId`, offset],
		queryFn: () =>
			apiClientApp.req<PendingFoodsByUserIdRes>({
				method: "GET",
				path: "/food/pending/find-by/user-id",
				params: {
					limit: `${PAGINATION_LIMIT}`,
					offset: `${offset}`,
					userId: userId
				}
			}),
		...options
	});

export const usePendingFoodsByuserTypeQuery = (
	offset: number,
	userType: string,
	options?: TokenGuardQueryOptions<ClientResponse<PendingFoodsByUserIdRes>>
) =>
	useTokenGuardQuery({
		queryKey: ["pendingFoodsByUserType", offset],
		queryFn: () =>
			apiClientApp.req<PendingFoodsByUserTypeRes>({
				method: "GET",
				path: "/food/pending/find-by/user-type",
				params: {
					limit: `${PAGINATION_LIMIT}`,
					offset: `${offset}`,
					userType: userType
				}
			}),
		...options
	});
