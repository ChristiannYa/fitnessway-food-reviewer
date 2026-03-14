export const AvailablePages = ({
	pageCount,
	currentPage,
	handlePageChange
}: {
	pageCount: number;
	currentPage: number;
	handlePageChange: (page: number) => void;
}) => {
	if (pageCount === 0) return null;

	return (
		<div className="flex mx-auto py-2 gap-3">
			{Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => handlePageChange(page)}
					className={`w-8 h-8 rounded-full font-semibold leading-none cursor-pointer
                                ${page === currentPage ? "bg-dry-green" : "bg-smoke"}`}
				>
					{page}
				</button>
			))}
		</div>
	);
};
