import { useState } from "react";
import { SearchOption } from "@/components/app/home/SearchOption";
import { UserIdSearch } from "@/components/app/home/UserIdSearch";
import { SEARCH_OPTIONS } from "@/types/userTypes";
import type { SearchOptions } from "@/types/userTypes"

export function Home() {
	const [searchOption, setSearchOption] = useState<SearchOptions | null>(null);

	return (
		<div className="min-h-screen bg-charcoal text-mist flex flex-col items-center pt-12">
			<div className="flex flex-col items-center gap-2 w-80">
				<div className="flex gap-x-4">
					{Object.values(SEARCH_OPTIONS).map((option) => {
						return (
							<SearchOption
								key={option}
								text={option}
								isSelected={searchOption === option}
								onClick={() => setSearchOption(option)}
							/>
						);
					})}
				</div>
				<UserIdSearch isVisible={searchOption === "User ID"} />
			</div>
		</div>
	);
}
