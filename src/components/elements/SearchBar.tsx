export const SearchBar = ({
	handleSearch,
	disabled = false
}: {
	handleSearch: () => void;
	disabled?: boolean;
}) => {
	return (
		<button
			onClick={handleSearch}
			disabled={disabled}
			className="py-2 rounded-4xl bg-smoke text-mist cursor-pointer
                       transition-colors disabled:opacity-20 disabled:cursor-default"
		>
			Search
		</button>
	);
};
