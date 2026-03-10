import { useAccessTokenStore } from "@/store/accessTokenStore";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export const useAuthQuery = <T>(
	options: Omit<UseQueryOptions<T>, "enabled"> & { enabled?: boolean }
) => {
	const isAuthenticated = !!useAccessTokenStore((s) => s.accessToken);

	return useQuery({
		...options,
		enabled: isAuthenticated && (options.enabled ?? true)
	});
};
