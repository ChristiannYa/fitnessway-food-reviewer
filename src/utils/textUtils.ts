export const isStringNullOrEmpty = (
	str: string | null | undefined
): str is null | undefined => str == null || str.trim().length === 0;

export function formatIsoDate(isoDate: string) {
	const date = new Date(isoDate);

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
