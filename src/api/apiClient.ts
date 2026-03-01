import { envValues } from "@/config/env";
import { catchingErrorT } from "@/errors/errorCatching";
import { RequestBaseError } from "@/errors/requestErrors";
import { accessTokenStore, AccessTokenStore } from "@/store/accessTokenStore";
import { refreshAccessTokenServerFn } from "./auth/authApi";
import { toCamelCase, toSnakeCase } from "@/utils/textCases";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpRequest<T> = {
    method: HttpMethod,
    path: string;
    body?: T,
    params?: Record<string, string>,
    isRetry?: boolean;
};

type HttpRequestData<T> = Omit<HttpRequest<T>, "isRetry">;

type ApiResponse<T> =
    | { success: true; message: string; data: T; }
    | { success: false; message: string; data: null; };

class ApiClient {
    constructor(
        private baseUrl: string,
        private accessTokenStore?: AccessTokenStore,
        private refreshHandler?: () => Promise<string | null>
    ) { }

    private async makeRequest<R, T = unknown>(req: HttpRequest<T>): Promise<ApiResponse<R>> {
        const url = new URL(`${this.baseUrl}${req.path}`);

        const headers = new Headers();
        headers.set("Content-Type", "application/json");

        if (this.accessTokenStore) {
            headers.set("Authorization", `Bearer ${this.accessTokenStore.getAccessToken()}`);
        }

        if (req.params) {
            Object.entries(req.params).forEach(([k, v]) => {
                url.searchParams.set(k, v);
            });
        }

        const res = await fetch(url, {
            method: req.method,
            headers: headers,
            body: req.body !== undefined ? JSON.stringify(
                toSnakeCase(req.body as object)
            ) : undefined
        });

        if (!res.ok) {
            const error = await res.json() as ApiResponse<never>;
            throw new RequestBaseError(error.message, res.status);
        }

        return toCamelCase(await res.json()) as ApiResponse<R>;
    }

    private async handleRequest<R, T = unknown>({
        method,
        path,
        body,
        params,
        isRetry = false
    }: HttpRequest<T>): Promise<ApiResponse<R>> {
        const [res, error] = await catchingErrorT(
            this.makeRequest<R, T>({ method, path, body, params }),
            [RequestBaseError]
        );

        if (error) {
            if (error.status === 401 && !isRetry) {
                if (!this.refreshHandler || !this.accessTokenStore) {
                    return this.error(error.message);
                }

                // The refresh handler lives outside ApiClient because reading httpOnly cookies
                // requires a server function — something ApiClient cannot do directly
                const newAccessToken = await this.refreshHandler();

                // Store only the access token
                if (newAccessToken) this.accessTokenStore.setAccessToken(newAccessToken);

                return this.handleRequest<R>({ method, path, body, isRetry: true });
            }

            return this.error(error.message);
        }

        return this.success(res);
    }

    private success = <T>(res: ApiResponse<T>): ApiResponse<T> => ({
        success: true as const,
        message: res.message,
        data: res.data as T
    });

    private error = (errorMessage: string): ApiResponse<never> => ({
        success: false as const,
        message: errorMessage,
        data: null
    });

    public req = async<R, T = unknown>(req: HttpRequestData<T>) => this.handleRequest<R>({
        method: req.method,
        path: req.path,
        body: req.body as R,
        params: req.params
    });
}

export const apiClientPub = new ApiClient(envValues.apiBaseUrl);

export const apiClientApp = new ApiClient(
    envValues.apiBaseUrl,
    accessTokenStore,
    refreshAccessTokenServerFn
);

