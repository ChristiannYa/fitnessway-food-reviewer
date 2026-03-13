import { USER_SCOPE } from "@/types/userTypes";
import type { UserScope as TUserScope } from "@/types/userTypes";

export const UserScope = ({
	currentScope,
	onScopeSelection
}: {
	currentScope: TUserScope | null;
	onScopeSelection: (option: TUserScope) => void;
}) => {
	return (
		<div className="flex gap-x-4">
			{Object.values(USER_SCOPE).map((scope) => {
				const isSelected = currentScope === scope;

				return (
					<button
						key={scope}
						onClick={() => onScopeSelection(scope)}
						className={`py-2 px-3 rounded-md transition-colors text-white relative
                                    ${isSelected ? "bg-dry-green" : "bg-smoke"} cursor-pointer`}
					>
						{scope}
					</button>
				);
			})}
		</div>
	);
};
