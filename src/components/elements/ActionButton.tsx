import type { LucideIcon } from "lucide-react";

type ActionButtonProps = {
	label: string;
	icon?: LucideIcon;
	bgColor?: string;
	iconSize?: number;
	disabled?: boolean;
	isActive?: boolean;
	onButtonClick: () => void;
};

export const ActionButton = ({
	label,
	icon,
	bgColor: color = "bg-transparent",
	iconSize = 18,
	disabled = false,
	isActive,
	onButtonClick
}: ActionButtonProps) => {
	const Icon = icon;

	return (
		<button
			onClick={onButtonClick}
			disabled={disabled}
			className={`flex grow justify-center items-center gap-1 py-2 px-3 ${color} rounded-lg border-2
                        border-transparent text-lg cursor-pointer transition-colors
                        ${isActive !== undefined && !isActive ? "hover:border-mist-300" : ""}`}
		>
			<p className="font-medium">{label}</p>
			{Icon && <Icon size={iconSize} strokeWidth={3} />}
		</button>
	);
};
