import { pxyReq } from "@/proxy/requestPxy";

export const getRefreshTokenPxy = () =>
	pxyReq<{ refreshToken: string }>("/pxy/token", { method: "GET" });

export const setRefreshTokenPxy = (refreshToken: string) =>
	pxyReq<never>("/pxy/token", {
		method: "POST",
		body: JSON.stringify({ refreshToken })
	});

export const deleteRefreshTokenPxy = () =>
	pxyReq<never>("/pxy/token", { method: "DELETE" });
