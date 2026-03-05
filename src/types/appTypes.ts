export type PaginationResult<T> = {
	data: T[];
	totalCount: number;
	pageCount: number;
	currentPage: number;
};
