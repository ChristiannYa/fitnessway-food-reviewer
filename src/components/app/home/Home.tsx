import { useState } from "react";
import { SearchOption } from "@/components/app/home/SearchOption";
import { UserIdSearch } from "@/components/app/home/UserIdSearch";

const SEARCH_OPTIONS = ["User Type", "User ID"] as const;

type SearchOptions = (typeof SEARCH_OPTIONS)[number];

export function Home() {
	const [searchOption, setSearchOption] = useState<SearchOptions | null>(null);

	return (
		<div className="min-h-screen bg-charcoal text-mist flex flex-col items-center p-4">
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
