import type { LoginReq } from "@/schemas/authSchema";
import type { LoginRes, LogoutReq, RefreshReq, RefreshRes } from "@/types/authTypes";
import { apiClientPub } from "@/api/apiClient";
import {
	deleteRefreshTokenPxy,
	getRefreshTokenPxy,
	setRefreshTokenPxy
} from "../proxy/refreshTokenPxy";

/**
 * The access token is intentionally **not** stored server-side, so the client is
 * responsible for storing it in memory upon receiving the response.
 */
export async function refreshAccessToken() {
	const refreshTokenPxyRes = await getRefreshTokenPxy();
	const refreshToken = refreshTokenPxyRes.data?.refreshToken ?? "";

	return await apiClientPub.req<RefreshRes>({
		method: "POST",
		path: "/auth/refresh",
		body: {
			refreshToken: refreshToken
		} as RefreshReq
	});
}

/**
 * Only the refresh token is stored server-side in cookies.
 * The client is responsible for storing the returned access token in memory.
 */
export async function login({ loginData }: { loginData: LoginReq }) {
	const res = await apiClientPub.req<LoginRes>({
		method: "POST",
		path: "/auth/login",
		body: loginData
	});

	if (!res.success) {
		return {
			...res,
			data: { accessToken: "" }
		};
	}

	await setRefreshTokenPxy(res.data.refreshToken);

	return {
		...res,
		data: { accessToken: res.data.accessToken }
	};
}

/**
 * Clears the refresh token cookie regardless of the API response.
 * The client is responsible for removing the access token from memory.
 */
export async function logout() {
	const refreshTokenPxyRes = await getRefreshTokenPxy();
	const refreshToken = refreshTokenPxyRes.data?.refreshToken ?? "";

	const body: LogoutReq = { refreshToken };

	const res = await apiClientPub.req<never>({
		method: "POST",
		path: "/auth/logout",
		body: body
	});

	await deleteRefreshTokenPxy();

	return res;
}
