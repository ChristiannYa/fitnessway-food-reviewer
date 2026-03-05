import { apiClientApp } from "@/api/apiClient";
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
					limit: "10",
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
					limit: "10",
					offset: `${offset}`,
					userType: userType
				}
			}),
		enabled: enabled
	});
