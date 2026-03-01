import { LoginReqSchema } from "@/schemas/authSchema";
import { type LoginRes, type LogoutReq, type RefreshReq, type RefreshRes } from "@/types/authTypes";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { apiClientPub } from "@/api/apiClient";

export const refreshAccessTokenServerFn = createServerFn({ method: "POST" })
    .handler(async () => {
        const body: RefreshReq = { refreshToken: getCookie("refreshToken") ?? "" };
        const res = await apiClientPub.req<RefreshRes>({
            method: "POST",
            path: "/auth/refresh",
            body: body
        });

        if (!res.success) {
            console.log(`error refreshing access token: ${res.message}`);
            return null;
        }

        // Return the access token so that the client stores it in memory
        return res.data.accessToken;
    });

export const loginServerFn = createServerFn({ method: "POST" })
    .inputValidator(LoginReqSchema)
    .handler(async ({ data }) => {
        const res = await apiClientPub.req<LoginRes>({
            method: "POST",
            path: "/auth/login",
            body: data
        });

        if (!res.success) return res;

        // Store only the refresh token in cookies because this is the responsibility 
        // of a server function only
        setRefreshTokenCookie(res.data.refreshToken);

        // Return the access token so that the client stores it in memory
        return {
            ...res,
            data: { accessToken: res.data.accessToken }
        };
    });

export const logoutServerFn = createServerFn({ method: "POST" })
    .handler(async () => {
        const body: LogoutReq = { refreshToken: getCookie("refreshToken") ?? "" };
        const res = await apiClientPub.req<never>({
            method: "POST",
            path: "/auth/logout",
            body: body
        });

        // Clear the cookie regardles of the response.
        // Client should be responsible of deleting the access token
        deleteCookie("refreshToken");

        if (!res.success) return res;

        return {
            success: true,
            message: res.message,
            data: null,
        };
    });

const setRefreshTokenCookie = (token: string) => setCookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
});