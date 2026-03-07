import { LoginReqSchema } from "@/schemas/authSchema";
import type { LoginRes, LogoutReq, RefreshReq, RefreshRes } from "@/types/authTypes";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { apiClientPub } from "@/api/apiClient";
import type { ClientResponse } from "@/api/apiClient";
import cookies from "@/config/cookies";

/**
 * The access token is intentionally **not** stored server-side, so the client is
 * responsible for storing it in memory upon receiving the response.
 */
export const refreshAccessTokenServerFn = createServerFn({
	method: "POST"
}).handler(async () => {
	const body: RefreshReq = { refreshToken: getCookie("refreshToken") ?? "" };

	return await apiClientPub.req<RefreshRes>({
		method: "POST",
		path: "/auth/refresh",
		body: body
	});
});

/**
 * Only the refresh token is stored server-side in cookies.
 * The client is responsible for storing the returned access token in memory.
 */
export const loginServerFn = createServerFn({ method: "POST" })
	.inputValidator(LoginReqSchema)
	.handler(async ({ data }) => {
		const res = await apiClientPub.req<LoginRes>({
			method: "POST",
			path: "/auth/login",
			body: data
		});

		if (!res.success) {
			return {
				...res,
				data: { accessToken: null }
			};
		}

		setCookie(cookies.refresh.name, res.data.refreshToken, cookies.refresh.options);

		return {
			...res,
			data: { accessToken: res.data.accessToken }
		};
	});

/**
 * Clears the refresh token cookie regardless of the API response.
 * The client is responsible for removing the access token from memory.
 */
export const logoutServerFn = createServerFn({ method: "POST" }).handler(
	async (): Promise<ClientResponse<never>> => {
		const body: LogoutReq = {
			refreshToken: getCookie("refreshToken") ?? ""
		};

		const res = await apiClientPub.req<never>({
			method: "POST",
			path: "/auth/logout",
			body: body
		});

		deleteCookie(cookies.refresh.name);

		return res;
	}
);
