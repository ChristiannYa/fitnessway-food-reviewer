import { apiClientApp } from "@/api/apiClient";
import { PAGINATION_LIMIT } from "@/constants";
import { useTokenGuardQuery } from "@/hooks/useTokenGuardQuery";
import type {
	PendingFoodsByUserIdRes,
	PendingFoodsByUserTypeRes
} from "@/types/foodTypes";

export const usePendingFoodsByUserIdQuery = (
	offset: number,
	enabled: boolean,
	userId: string
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
		enabled: enabled
	});

export const usePendingFoodsByuserTypeQuery = (
	offset: number,
	enabled: boolean,
	userType: string
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
		enabled: enabled
	});
