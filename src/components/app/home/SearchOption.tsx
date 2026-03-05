type SearchOptionProps = {
	text: string;
	isSelected: boolean;
	onClick: () => void;
};

export const SearchOption = ({ text, isSelected, onClick }: SearchOptionProps) => {
	return (
		<button
			onClick={onClick}
			className={`py-2 px-3 rounded-md transition-colors text-white relative
                        ${isSelected ? "bg-dry-green" : "bg-smoke"}`}
		>
			{text}
		</button>
	);
};
