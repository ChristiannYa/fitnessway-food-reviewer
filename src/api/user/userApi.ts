import { useQuery } from "@tanstack/react-query";
import type { UserRes } from "@/types/userTypes";
import { apiClientApp } from "../apiClient";

export const useCurrentUser = () => useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiClientApp.req<UserRes>({
        method: "GET",
        path: "/user"
    })
});
