import type { UseQueryOptions } from "@tanstack/react-query";

export type AppQueryOptions<T> = Omit<
	UseQueryOptions<T>,
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
