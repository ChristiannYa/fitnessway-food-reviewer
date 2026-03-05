import type { UserRes } from "@/types/userTypes";
import { apiClientApp } from "@/api/apiClient";
import { useTokenGuardQuery } from "@/hooks/useTokenGuardQuery";

export const useUserQuery = () =>
	useTokenGuardQuery({
		queryKey: ["user"],
		queryFn: () =>
			apiClientApp.req<UserRes>({
				method: "GET",
				path: "/user"
			})
	});
