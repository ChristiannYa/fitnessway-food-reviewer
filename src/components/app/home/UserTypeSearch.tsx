import { SearchBar } from "@/components/elements/SearchBar";
import { Spinner } from "@/components/elements/Spinner";
import { pagination } from "@/constants";
import { useReviewMutation } from "@/hooks/mutations/foodMutations";
import { PendingFoodQueries } from "@/hooks/queries/foodQueries";
import { useSearch } from "@/hooks/useSearch";
import type {
	PendingFood,
	PendingFoodsReqParams,
	PendingFoodStatus
} from "@/types/foodTypes";
import { USER_TYPE } from "@/types/userTypes";
import type { UserType } from "@/types/userTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AvailablePages } from "./AvailablePages";
import { Grid } from "@/components/foods/pending/Grid";
import { Information } from "@/components/foods/pending/Information";
import { getUserTypeIcon } from "@/utils/userUtils";
import { isStringNullOrEmpty } from "@/utils/textUtils";

export const UserTypeSearch = ({
	isVisible,
	currentPendingStatus
}: {
	isVisible: boolean;
	currentPendingStatus: PendingFoodStatus | null;
}) => {
	const queryClient = useQueryClient();

	const [offset, setOffset] = useState(0);
	const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
	const [selectedFood, setSelectedFood] = useState<PendingFood | null>(null);

	const [userTypeSearched, setUserTypeSearched] = useState<string>("");
	const [statusFilterInSearch, setStatusFilterInSearch] =
		useState<PendingFoodStatus | null>(null);

	const reqParams: PendingFoodsReqParams<{ userType: UserType }> = {
		userType: userTypeSearched as UserType,
		offset,
		status: statusFilterInSearch ?? undefined
	};

	const {
		isError: pfResError,
		isFetching: pfFetching,
		data: pfData,
		refetch: pfRefetch
	} = PendingFoodQueries.ByUserType.use(reqParams, { enabled: false });

	const reviewMutation = useReviewMutation(
		{
			offset,
			searchType: "User Type",
			userType: userTypeSearched as UserType,
			status: statusFilterInSearch ?? undefined
		},
		(optReview) => {
			setSelectedFood(optReview);
		}
	);

	const searchFailed = (() => {
		const apiError = pfData && !pfData.success;
		return !pfFetching && (pfResError || !!apiError);
	})();

	const queryData = pfData?.data?.pendingFoodsPagination;

	function handleSearch() {
		if (selectedUserType === null) return;

		setOffset(0);
		setStatusFilterInSearch(currentPendingStatus);
		setUserTypeSearched(selectedUserType);
	}

	function handlePageChange(page: number) {
		setOffset((page - 1) * pagination.limit);
	}

	useSearch({
		deps: reqParams,
		use: isVisible,
		mountGuard: isStringNullOrEmpty(userTypeSearched),
		cache: queryClient.getQueryData(
			PendingFoodQueries.ByUserType.getOptions(reqParams).queryKey
		),
		refetchFn: pfRefetch
	});

	if (!isVisible) return null;

	return (
		<div className="flex flex-col gap-2">
			{searchFailed && (
				<p className="text-red-500 text-center">
					Error fetching foods by User Type
				</p>
			)}

			<div className="flex flex-col mx-auto gap-4 w-90">
				<div className="flex justify-center gap-6">
					{Object.values(USER_TYPE).map((type) => {
						const isActive = type === selectedUserType;
						const Icon = getUserTypeIcon(type);

						return (
							<button
								key={type}
								onClick={() =>
									setSelectedUserType(
										selectedUserType === type ? null : type
									)
								}
								className={`${isActive ? "font-extrabold" : "font-thin hover:text-white"}
                                            flex items-center gap-0.5 py-1 cursor-pointer`}
							>
								<Icon size={14} strokeWidth={isActive ? 3 : 1} />
								{type}
							</button>
						);
					})}
				</div>
				<SearchBar
					handleSearch={handleSearch}
					disabled={selectedUserType === null}
				/>
			</div>

			{pfFetching && (
				<div className="mx-auto">
					<Spinner size={16} />
				</div>
			)}

			{queryData && (
				<>
					<AvailablePages
						pageCount={queryData.pageCount}
						currentPage={queryData.currentPage}
						handlePageChange={handlePageChange}
					/>
					<Grid
						pendingFoods={queryData.data}
						onFoodClick={setSelectedFood}
						withUserId={true}
					/>
				</>
			)}

			{selectedFood && (
				<div
					onClick={() => setSelectedFood(null)}
					className="fixed inset-0 flex items-center justify-center bg-black/40 
                               backdrop-blur-md z-20"
				>
					<div onClick={(e) => e.stopPropagation()}>
						<Information
							pendingFood={selectedFood}
							onHandleReview={(req) => reviewMutation.mutate(req)}
							withUserId={true}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
