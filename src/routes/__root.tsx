import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/layout/Header";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import type { QueryClient } from "@tanstack/react-query";
import { refreshAccessToken } from "@/auth/authHandlers";
import { useAccessTokenStore } from "@/store/accessTokenStore";
import { getRefreshTokenPxy } from "@/proxy/refreshTokenPxy";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	notFoundComponent: () => <p>404 - Page not found</p>,
	beforeLoad: async () => {
		// If a token is already in memory, skip the refresh.
		// This guard prevents unnecessary token refreshes since `beforeLoad` runs on
		// every route navigation and preload (e.g. hovering over a `Link` component
		// with the `preload: "intent"` attribute).
		const accessToken = useAccessTokenStore.getState().accessToken;
		if (accessToken) return;

		// If no refresh token is saved in cookies, it means that the user is
		// unauthenticated. With this information, we add a guard that avoids making
		// an unecessary refresh attempt
		const refreshTokenPxyRes = await getRefreshTokenPxy();
		const refreshToken = refreshTokenPxyRes.data?.refreshToken;
		if (!refreshToken) return;

		const refreshTokenApiRes = await refreshAccessToken(refreshToken);
		if (!refreshTokenApiRes.data) return;

		useAccessTokenStore.getState().save(refreshTokenApiRes.data.accessToken);
	},
	component: RootDocument
});

function RootDocument() {
	return (
		<TanStackQueryProvider>
			<Header />
			<Outlet />
			<TanStackRouterDevtools />
		</TanStackQueryProvider>
	);
}
