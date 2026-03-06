export const isStringNullOrEmpty = (
	str: string | null | undefined
): str is null | undefined => str == null || str.trim().length === 0;

export const formatIsoDate = (isoDate: string) => {
	const date = new Date(isoDate);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
};

export const uuidFirst = (uuid: string) => uuid.split("-")[0];
