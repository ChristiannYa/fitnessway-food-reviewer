import { usePendingFoodsByUserIdQuery } from "@/hooks/queries/foodQueries";
import { isStringNullOrEmpty } from "@/utils/textUtils";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/elements/Spinner";
import { useAutoClear } from "@/hooks/useAutoClear";
import type { PendingFood } from "@/types/foodTypes";
import { getPendingFoodStatusColor } from "@/utils/foodUtils";

export const UserIdSearch = ({ isVisible }: { isVisible: boolean }) => {
	const [offset, setOffset] = useState(0);
	const [userIdQueryParam, setUserIdQueryParam] = useState<string | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

	const {
		isError: pfByUserIdQuError,
		isPending: pfByUserIdQuPending,
		data: pfByUserIdQuData,
		refetch: pfByUserIdQuRefetch
	} = usePendingFoodsByUserIdQuery(offset, hasSearched, userIdQueryParam ?? "");

	const isDataLoading = pfByUserIdQuPending && hasSearched;

	const searchFailed = (() => {
		const apiError = pfByUserIdQuData && !pfByUserIdQuData.success;
		return hasSearched && !isDataLoading && (pfByUserIdQuError || !!apiError);
	})();

	useAutoClear(searchFailed, () => setHasSearched(false));

	const queryData = pfByUserIdQuData?.data?.pendingFoodsPagination;
	const totalCount = queryData?.totalCount ?? 0;

	function handleSearch() {
		setHasSearched(true);
		if (queryData || searchFailed) pfByUserIdQuRefetch();
	}

	if (!isVisible) return null;

	return (
		<>
			{searchFailed && (
				<p className="text-red-500 text-center">
					Error fetching foods by User ID
				</p>
			)}

			<input
				type="text"
				name="user_id"
				id="user_id"
				placeholder="User ID"
				value={userIdQueryParam ?? ""}
				onChange={(e) => setUserIdQueryParam(e.target.value)}
				className="px-3 py-2 w-full border border-smoke focus:ring-1 focus:ring-mist 
                           focus:outline-0"
			/>

			<button
				onClick={handleSearch}
				disabled={isStringNullOrEmpty(userIdQueryParam)}
				className="py-2 w-full rounded-md bg-smoke text-mist disabled:opacity-50 
                          transition-colors"
			>
				Search
			</button>

			{isDataLoading && (
				<div className="mx-auto">
					<Spinner size={16} />
				</div>
			)}

			{queryData && (
				<>
					<p className="text-2xl font-bold">Total Count: {totalCount}</p>
					<PendingFoods pendingFoods={queryData.data} />
				</>
			)}
		</>
	);
};

const PendingFoods = ({ pendingFoods }: { pendingFoods: PendingFood[] }) => {
	if (pendingFoods.length === 0) {
		return <p className="text-center">No foods available</p>;
	}

	return pendingFoods.map((food) => {
		const foodBase = food.information.base;

		const amountPerServing = `${foodBase.amountPerServing} ${foodBase.servingUnit.toLowerCase()}`;
		const foodStatusColor = getPendingFoodStatusColor(food.status);

		return (
			<div
				key={food.id}
				className="flex flex-col w-full gap-0.5 p-3 bg-mist/5 rounded-xl text-lg"
			>
				<div className="mb-1">
					<p className={`${foodStatusColor} font-bold`}>{food.status}</p>
				</div>
				<InformationPair name="Name" value={foodBase.name} />
				<InformationPair name="Brand" value={foodBase.brand ?? "undefined"} />
				<InformationPair name="Amount Per Serving" value={amountPerServing} />
			</div>
		);
	});
};

const InformationPair = ({ name, value }: { name: string; value: string }) => {
	return (
		<p>
			<span className="font-semibold">{name}:</span> {value}
		</p>
	);
};
