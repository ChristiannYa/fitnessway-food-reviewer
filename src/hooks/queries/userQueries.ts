import type { UserRes } from "@/types/userTypes";
import { apiClientApp } from "@/api/apiClient";
import { useTokenGuardQuery } from "@/hooks/useTokenGuardQuery";
import { queryKeys } from "@/constants";

export const useUserQuery = () =>
	useTokenGuardQuery({
		queryKey: queryKeys.user.me(),
		queryFn: () =>
			apiClientApp.req<UserRes>({
				method: "GET",
				path: "/user"
			})
	});
