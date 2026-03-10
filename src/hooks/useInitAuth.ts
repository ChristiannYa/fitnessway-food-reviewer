import { refreshAccessToken } from "@/auth/authHandlers";
import { getRefreshTokenPxy } from "@/proxy/refreshTokenPxy";
import { useAccessTokenStore } from "@/store/accessTokenStore";
import { useEffect } from "react";

export function useInitAuth() {
	useEffect(() => {
		async function initAuth() {
			const refreshTokenPxyRes = await getRefreshTokenPxy();
			if (!refreshTokenPxyRes.data?.refreshToken) return;

			const refreshTokenApiRes = await refreshAccessToken();

			if (refreshTokenApiRes.data?.accessToken) {
				useAccessTokenStore.getState().save(refreshTokenApiRes.data.accessToken);
			}
		}

		initAuth();
	}, []);
}
