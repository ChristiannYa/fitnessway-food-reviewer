import type { UseQueryOptions } from "@tanstack/react-query";

export type ClientQueryOptions<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;

export type PaginationResult<T> = {
	data: T[];
	totalCount: number;
	pageCount: number;
	currentPage: number;
};
