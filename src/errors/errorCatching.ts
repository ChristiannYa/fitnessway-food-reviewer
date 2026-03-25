export async function catchingErrorT<
	T,
	E extends new (message: string, status: number) => Error
>(promise: Promise<T>, typedErrors?: E[]): Promise<[T, null] | [null, InstanceType<E>]> {
	return promise
		.then((data) => {
			return [data, null] as [T, null];
		})
		.catch((error) => {
			if (typedErrors == undefined || typedErrors.some((e) => error instanceof e))
				return [null, error];

			throw error;
		});
}
