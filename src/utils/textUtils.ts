export const isStringNullOrEmpty = (
	str: string | null | undefined
): str is null | undefined => str == null || str.trim().length === 0;
