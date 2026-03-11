import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";

/**
 * Base options for queries, extending React Query's `UseQueryOptions`
 * while omitting internally managed fields (`queryKey`, `queryFn`, `enabled`)
 * and replacing `enabled` with a simpler `boolean` type.
 *
 * @template T - The data type returned by the query.
 * @template Q - The query key tuple type. Defaults to `QueryKey`.
 *               Pass the exact key type to preserve type inference when
 *               spreading with `queryOptions()` factories.
 */
export type AppQueryOptions<T, Q extends QueryKey = QueryKey> = Omit<
	UseQueryOptions<T, Error, T, Q>,
	"queryKey" | "queryFn" | "enabled"
> & {
	enabled?: boolean;
};

export type PaginationResult<T> = {
	data: T[];
	totalCount: number;
	pageCount: number;
	currentPage: number;
};
