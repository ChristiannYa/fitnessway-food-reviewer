import { envValues } from "@/config/env";
import { catchingErrorT } from "@/errors/errorCatching";
import { ApiRequestBaseError } from "@/errors/requestErrors";
import { refreshAccessToken } from "@/auth/authHandlers";
import type { RefreshRes } from "@/types/authTypes";
import { useAccessTokenStore } from "@/store/accessTokenStore";
import type { ClientResponse } from "@/types/appTypes";
import { clientError, clientSuccess } from "@/utils/clientUtils";
import { toSnakeCase, toCamelCase } from "@/utils/textUtils";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpRequest<T> = {
	method: HttpMethod;
	path: string;
	body?: T;
	params?: Record<string, string>;
	isRetry?: boolean;
};

type HttpRequestData<T> = Omit<HttpRequest<T>, "isRetry">;

type ApiResponse<T> =
	| { success: true; message: string; data: T }
	| { success: false; message: string; data: null };

class ApiClient {
	constructor(
		private baseUrl: string,
		private refreshHandler?: () => Promise<ClientResponse<RefreshRes>>
	) {}

	private async makeRequest<R, T = unknown>(
		req: HttpRequest<T>
	): Promise<ApiResponse<R>> {
		const url = new URL(`${this.baseUrl}${req.path}`);

		const headers = new Headers();
		headers.set("Content-Type", "application/json");

		const accessToken = useAccessTokenStore.getState().accessToken;

		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}

		if (req.params) {
			Object.entries(req.params).forEach(([k, v]) => {
				url.searchParams.set(k, v);
			});
		}

		const res = await fetch(url, {
			method: req.method,
			headers: headers,
			body:
				req.body !== undefined
					? JSON.stringify(toSnakeCase(req.body as object))
					: undefined
		});

		if (!res.ok) {
			const error = (await res.json()) as ApiResponse<never>;
			throw new ApiRequestBaseError(error.message, res.status);
		}

		return toCamelCase(await res.json()) as ApiResponse<R>;
	}

	private async handleRequest<R, T = unknown>({
		method,
		path,
		body,
		params,
		isRetry = false
	}: HttpRequest<T>): Promise<ClientResponse<R>> {
		const [requestRes, requestError] = await catchingErrorT(
			this.makeRequest<R, T>({ method, path, body, params }),
			[ApiRequestBaseError]
		);

		if (requestError !== null) {
			if (requestError.status === 401 && !isRetry) {
				// Guard that returns early because the api client is a public instance
				if (!this.refreshHandler) {
					return clientError(requestError.message, requestError.status);
				}

				// The refresh handler lives outside ApiClient because reading httpOnly cookies
				// requires a server function — something ApiClient cannot do directly
				const refreshRes = await this.refreshHandler();

				if (!refreshRes.success) {
					console.log("error refreshing access token: ", refreshRes.message);
					return clientError(refreshRes.message, refreshRes.status);
				}

				useAccessTokenStore.getState().save(refreshRes.data.accessToken);

				// Retry same request with refreshed access token
				return this.handleRequest<R>({
					method,
					path,
					body,
					params,
					isRetry: true
				});
			}

			return clientError(requestError.message, requestError.status);
		}

		return clientSuccess(requestRes.data as R);
	}

	public req = async <R, T = unknown>(req: HttpRequestData<T>) =>
		this.handleRequest<R>({
			method: req.method,
			path: req.path,
			body: req.body as R,
			params: req.params
		});
}

export const apiClientPxy = new ApiClient(envValues.pxyBaseUrl);

export const apiClientPub = new ApiClient(envValues.apiBaseUrl);

export const apiClientApp = new ApiClient(envValues.apiBaseUrl, refreshAccessToken);
