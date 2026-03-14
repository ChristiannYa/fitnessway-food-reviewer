import { ActionButton } from "@/components/elements/ActionButton";
import { USER_SCOPE } from "@/types/userTypes";
import type { UserScope as TUserScope } from "@/types/userTypes";

export const UserScope = ({
	currentScope,
	onScopeSelection
}: {
	currentScope: TUserScope | null;
	onScopeSelection: (scope: TUserScope) => void;
}) => {
	return (
		<div className="flex gap-x-4">
			{Object.values(USER_SCOPE).map((scope) => {
				const isSelected = currentScope === scope;

				return (
					<ActionButton
						key={scope}
						label={scope}
						onButtonClick={() => onScopeSelection(scope)}
						bgColor={isSelected ? "bg-dry-green" : "bg-smoke"}
						isActive={isSelected}
					/>
				);
			})}
		</div>
	);
};
