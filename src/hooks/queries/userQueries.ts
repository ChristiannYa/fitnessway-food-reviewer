import { useQuery } from "@tanstack/react-query";
import type { UserRes } from "@/types/userTypes";
import { apiClientApp } from "@/api/apiClient";

export const useUser = () =>
	useQuery({
		queryKey: ["user"],
		queryFn: () =>
			apiClientApp.req<UserRes>({
				method: "GET",
				path: "/user"
			})
	});
