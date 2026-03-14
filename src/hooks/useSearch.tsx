import type { ClientResponse } from "@/utils/clientUtils";
import { useEffect } from "react";

/**
 * Triggers a fetch if any property from `deps` change as long as there is enough
 * information to make a search and the data is not already cached.
 *
 * @param deps - The dependencies that determine the search query.
 * @param mountGuard - Guard that helps to avoid making a server call on initial mount when there is not enough information to make a search.
 * @param cache - The cached data for the current search parameters.
 * @param refetchFn - The function to call when a fetch is needed.
 */
export function useSearch<D, C>({
	deps,
	use,
	mountGuard,
	cache,
	refetchFn
}: {
	deps: D;
	use: boolean;
	mountGuard: boolean;
	cache: ClientResponse<C> | undefined;
	refetchFn: () => void;
}) {
	useEffect(() => {
		if (!use || mountGuard || cache) return;
		refetchFn();
	}, [deps]);
}
