import type { UseQueryOptions } from "@tanstack/react-query";

export type ClientResponse<T> =
	| { success: true; message: null; status: null; data: T }
	| { success: false; message: string; status: number; data: null };

export type ClientQueryOptions<T> = Omit<
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
