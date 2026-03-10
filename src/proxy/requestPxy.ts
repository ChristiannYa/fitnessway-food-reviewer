import { envValues } from "@/config/env";
import { catchingErrorT } from "@/errors/errorCatching";
import { PxyRequestBaseError } from "@/errors/requestErrors";
import { clientError, clientSuccess } from "@/utils/clientUtils";

async function makePxyRequest<R>(path: string, options?: RequestInit): Promise<R> {
	const res = await fetch(`${envValues.pxyBaseUrl}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options
	});

	if (!res.ok) {
		const error = await res.json();
		throw new PxyRequestBaseError(
			error.message ?? "Proxy request failed",
			res.status
		);
	}

	return res.json() as Promise<R>;
}

async function handlePxyRequest<R>(path: string, options?: RequestInit) {
	const [res, error] = await catchingErrorT(makePxyRequest<R>(path, options), [
		PxyRequestBaseError
	]);
	if (error !== null) return clientError(error.message, error.status);

	return clientSuccess(res);
}

export { handlePxyRequest as pxyReq };
