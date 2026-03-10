type CamelToSnake<T extends string> = T extends `${infer Head}${infer Tail}`
	? Head extends Uppercase<Head>
		? `_${Lowercase<Head>}${CamelToSnake<Tail>}`
		: `${Head}${CamelToSnake<Tail>}`
	: T;

type SnakeCased<T> = {
	[K in keyof T as CamelToSnake<string & K>]: T[K];
};

type SnakeToCamel<T extends string> = T extends `${infer Head}_${infer Tail}`
	? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
	: T;

type CamelCased<T> = T extends object
	? { [K in keyof T as SnakeToCamel<string & K>]: CamelCased<T[K]> }
	: T;

export function toSnakeCase<T extends object>(obj: T): SnakeCased<T> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
			value
		])
	) as SnakeCased<T>;
}

export function toCamelCase<T>(obj: T): CamelCased<T> {
	if (Array.isArray(obj)) {
		return obj.map(toCamelCase) as CamelCased<T>;
	}

	if (obj !== null && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => [
				key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
				toCamelCase(value)
			])
		) as CamelCased<T>;
	}

	return obj as CamelCased<T>;
}

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
