import { envValues } from "@/config/env";
import { catchingErrorT } from "@/errors/errorCatching";
import { RequestBaseError } from "@/errors/requestErrors";
import type { AccessTokenStore } from "@/store/accessTokenStore";
import { accessTokenStore as accessTokenStoreInstance } from "@/store/accessTokenStore";
import { refreshAccessTokenServerFn } from "@/server/authServerFns";
import { toCamelCase, toSnakeCase } from "@/utils/textCases";
import type { RefreshRes } from "@/types/authTypes";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpRequest<T> = {
	method: HttpMethod;
	path: string;
	body?: T;
	params?: Record<string, string>;
	isRetry?: boolean;
};

type HttpRequestData<T> = Omit<HttpRequest<T>, "isRetry">;

type ServerResponse<T> =
	| { success: true; message: string; data: T }
	| { success: false; message: string; data: null };

export type ClientResponse<T> =
	| { success: true; message: null; status: null; data: T }
	| { success: false; message: string; status: number; data: null };

class ApiClient {
	constructor(
		private baseUrl: string,
		private accessTokenStore?: AccessTokenStore,
		private refreshHandler?: () => Promise<ClientResponse<RefreshRes>>
	) {}

	private async makeRequest<R, T = unknown>(
		req: HttpRequest<T>
	): Promise<ServerResponse<R>> {
		const url = new URL(`${this.baseUrl}${req.path}`);

		const headers = new Headers();
		headers.set("Content-Type", "application/json");

		if (this.accessTokenStore) {
			headers.set(
				"Authorization",
				`Bearer ${this.accessTokenStore.getAccessToken()}`
			);
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
			const error = (await res.json()) as ServerResponse<never>;
			throw new RequestBaseError(error.message, res.status);
		}

		return toCamelCase(await res.json()) as ServerResponse<R>;
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
			[RequestBaseError]
		);

		if (requestError) {
			if (requestError.status === 401 && !isRetry) {
				// Guard that returns early because the api client is a public instance
				if (!this.refreshHandler || !this.accessTokenStore) {
					return this.error(requestError.message, requestError.status);
				}

				// The refresh handler lives outside ApiClient because reading httpOnly cookies
				// requires a server function — something ApiClient cannot do directly
				const refreshRes = await this.refreshHandler();

				if (!refreshRes.success) {
					console.log("error refreshing access token: ", refreshRes.message);
					return this.error(refreshRes.message, refreshRes.status);
				}

				this.accessTokenStore.setAccessToken(refreshRes.data.accessToken);

				// Retry same request with refreshed access token
				return this.handleRequest<R>({
					method,
					path,
					body,
					params,
					isRetry: true
				});
			}

			return this.error(requestError.message, requestError.status);
		}

		return this.success(requestRes.data as R);
	}

	private success = <T>(data: T): ClientResponse<T> => ({
		success: true as const,
		message: null,
		status: null,
		data: data
	});

	private error = (message: string, status: number): ClientResponse<never> => ({
		success: false as const,
		message: message,
		status: status,
		data: null
	});

	public req = async <R, T = unknown>(req: HttpRequestData<T>) =>
		this.handleRequest<R>({
			method: req.method,
			path: req.path,
			body: req.body as R,
			params: req.params
		});
}

export const apiClientPub = new ApiClient(envValues.apiBaseUrl);

export const apiClientApp = new ApiClient(
	envValues.apiBaseUrl,
	accessTokenStoreInstance,
	refreshAccessTokenServerFn
);
