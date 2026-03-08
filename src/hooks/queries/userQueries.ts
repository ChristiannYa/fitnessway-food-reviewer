import type { UserRes } from "@/types/userTypes";
import { apiClientApp } from "@/api/apiClient";
import { queryKeys } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export const useUserQuery = () =>
	useQuery({
		queryKey: queryKeys.user.me(),
		queryFn: () =>
			apiClientApp.req<UserRes>({
				method: "GET",
				path: "/user"
			})
	});
