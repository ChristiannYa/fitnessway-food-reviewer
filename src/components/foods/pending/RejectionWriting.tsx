import { ActionButton } from "@/components/elements/ActionButton";
import { isStringNullOrEmpty } from "@/utils/textUtils";
import { useState } from "react";

export const RejectionWriting = ({
	onCancelRejection,
	onReject
}: {
	onCancelRejection: () => void;
	onReject: (reason: string) => void;
}) => {
	const [hasClickedRejected, setHasClickedRejected] = useState<boolean>(false);
	const [rejectionReason, setRejectionreason] = useState<string>("");

	function handleReject() {
		setHasClickedRejected(false);
		onReject(rejectionReason);
	}

	return (
		<div className="flex flex-col p-3 w-full h-full absolute bg-black/50 backdrop-blur-lg">
			<div className="grow my-4 w-full relative bg-smoke/40 border border-smoke rounded-lg">
				{!hasClickedRejected ? (
					<textarea
						value={rejectionReason}
						onChange={(e) => setRejectionreason(e.target.value)}
						placeholder="Rejection reason..."
						className="w-full h-full p-4 focus:outline-none focus:ring-1 focus:ring-mist 
                                   rounded-lg resize-none"
					/>
				) : (
					<div
						className="absolute top-0 left-0 px-2 w-full h-full flex flex-col justify-center 
                                    items-center gap-8"
					>
						<p>Reject?</p>
						<div className="flex w-full gap-2 pb-1">
							<ActionButton
								label="No"
								onButtonClick={() => setHasClickedRejected(false)}
							/>
							<ActionButton
								label="Yes"
								bgColor="bg-rose-600"
								onButtonClick={handleReject}
							/>
						</div>
					</div>
				)}
			</div>
			{!hasClickedRejected && (
				<div className="flex w-full gap-2 pb-1">
					<ActionButton label="Cancel" onButtonClick={onCancelRejection} />
					<ActionButton
						label="Reject"
						bgColor="bg-rose-600"
						disabled={isStringNullOrEmpty(rejectionReason)}
						onButtonClick={() => setHasClickedRejected(true)}
					/>
				</div>
			)}
		</div>
	);
};
