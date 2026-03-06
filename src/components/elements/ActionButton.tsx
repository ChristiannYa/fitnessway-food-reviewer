import type { LucideIcon } from "lucide-react";

type ActionButtonProps = {
	label: string;
	icon?: LucideIcon;
	bgColor?: string;
	iconSize?: number;
	disabled?: boolean;
	onButtonClick: () => void;
};

export const ActionButton = ({
	label,
	icon,
	bgColor: color = "bg-transparent",
	iconSize = 18,
	disabled = false,
	onButtonClick
}: ActionButtonProps) => {
	const Icon = icon;

	return (
		<button
			onClick={onButtonClick}
			disabled={disabled}
			className={`flex grow justify-center items-center gap-1 py-2 ${color} rounded-lg border-2
                        border-transparent text-lg cursor-pointer hover:border-mist-300 transition-colors`}
		>
			<p className="font-semibold">{label}</p>
			{Icon && <Icon size={iconSize} strokeWidth={3} />}
		</button>
	);
};
