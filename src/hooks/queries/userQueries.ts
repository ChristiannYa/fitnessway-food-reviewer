import type { UserRes } from "@/types/userTypes";
import { apiClientApp } from "@/api/apiClient";
import { queryKeys } from "@/constants";
import { useAuthQuery } from "../useAuthQuery";

export const useUserQuery = () =>
	useAuthQuery({
		queryKey: queryKeys.user.me(),
		queryFn: () =>
			apiClientApp.req<UserRes>({
				method: "GET",
				path: "/user"
			})
	});
