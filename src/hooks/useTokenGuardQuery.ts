import { accessTokenStore } from "@/store/accessTokenStore";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

/**
 * Full query options for `useTokenGuardQuery()`.
 *
 * Extends `UseQueryOptions` with `enabled` narrowed to `boolean | undefined`,
 * preventing the function `(query) => boolean` from being passed in as it's
 * incompatible with the internal token check that combines it via `&&`
 */
type TokenGuardOptions<T> = Omit<UseQueryOptions<T>, "enabled"> & {
	enabled?: boolean;
};

/**
 * Query options accepted by consumers of `useTokenGuardQuery`.
 *
 * Derived from `TokenGuardOptions` with `queryKey` and `queryFn` omitted
 * since those are written internally by each query hook
 */
export type TokenGuardQueryOptions<T> = Omit<
	TokenGuardOptions<T>,
	"queryKey" | "queryFn"
>;

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
 * the token check — both must be true for the query to fire
 */
export const useTokenGuardQuery = <T>(options: TokenGuardOptions<T>) =>
	useQuery({
		...options,
		enabled: !!accessTokenStore.getAccessToken() && (options.enabled ?? true)
	});
