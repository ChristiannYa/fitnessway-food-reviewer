type spinner = {
	size?: number;
};

export const Spinner = ({ size = 16 }: spinner) => {
	return (
		<div
			className="rounded-full border-2 border-white border-t-transparent animate-spin"
			style={{
				width: size,
				height: size
			}}
		></div>
	);
};
