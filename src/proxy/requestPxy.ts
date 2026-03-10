import { envValues } from "@/config/env";
import { catchingErrorT } from "@/errors/errorCatching";
import { PxyRequestBaseError } from "@/errors/requestErrors";
import { clientError, clientSuccess } from "@/utils/clientUtils";
import type { ClientResponse } from "@/utils/clientUtils";
import { toCamelCase } from "@/utils/textUtils";
import type { ProxyResponse } from "types/serverTypes";

async function makePxyRequest<R>(
	path: string,
	options?: RequestInit
): Promise<ProxyResponse<R>> {
	const res = await fetch(`${envValues.pxyBaseUrl}${path}`, {
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		...options
	});

	if (!res.ok) {
		throw new PxyRequestBaseError(`Proxy request to ${path} failed`, res.status);
	}

	return toCamelCase(await res.json()) as ProxyResponse<R>;
}

async function handlePxyRequest<R>(
	path: string,
	options?: RequestInit
): Promise<ClientResponse<R>> {
	const [res, error] = await catchingErrorT(makePxyRequest<R>(path, options), [
		PxyRequestBaseError
	]);
	if (error !== null) return clientError(error.message, error.status);

	return clientSuccess(res.data as R);
}

export { handlePxyRequest as pxyReq };
