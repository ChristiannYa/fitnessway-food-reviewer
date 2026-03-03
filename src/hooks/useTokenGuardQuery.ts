import { accessTokenStore } from "@/store/accessTokenStore";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

/**
 * A wrapper around `useQuery` that guards execution behind a valid access token.
 *
 * By default, queries are only enabled when an access token is present in the
 * `accessTokenStore`. This is necessary because the root route's `beforeLoad`
 * runs on the server, so the token it fetches is not automatically available
 * in the browser's store on hydration. The `RootDocument` component bridges
 * this gap by seeding the client store from the router context.
 *
 * An additional `enabled` condition can be passed and will be combined with
 * the token check — both must be true for the query to fire.
 */
export const useTokenGuardQuery = <T>(
	options: Omit<UseQueryOptions<T>, "enabled"> & {
		enabled?: boolean;
	}
) =>
	useQuery({
		...options,
		enabled:
			!!accessTokenStore.getAccessToken() && (options.enabled ?? true)
	});
