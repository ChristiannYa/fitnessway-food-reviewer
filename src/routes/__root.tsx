import {
	HeadContent,
	Scripts,
	createRootRouteWithContext
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Header from "../components/layout/Header";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { accessTokenStore } from "@/store/accessTokenStore";
import { refreshAccessTokenServerFn } from "@/server/authServerFns";
import { useEffect } from "react";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "Fitnessway Food Review"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss
			}
		]
	}),
	beforeLoad: async () => {
		if (!accessTokenStore.getAccessToken()) {
			const newAccessToken = await refreshAccessTokenServerFn();
			if (newAccessToken) accessTokenStore.setAccessToken(newAccessToken);
		}

		return {
			accessTokenSsr: accessTokenStore.getAccessToken()
		};
	},
	notFoundComponent: () => <p>404 - Page not found</p>,
	shellComponent: RootDocument
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { accessTokenSsr } = Route.useRouteContext();

	// The root route's `beforeLoad()` runs on the server, so the acess token that is
	// refreshed is stored in the server's `AccessTokenStore` instance, not the browser's.
	//
	// Here we bridge that gap by seeding the browser's store with the token passed down
	// through the router context, which TanStack Start serializes into the HTML.
	//
	// This runs once on hydration, making the token available to all queries
	// wrapped in useTokenGuardQuery().
	useEffect(() => {
		if (accessTokenSsr && !accessTokenStore.getAccessToken()) {
			accessTokenStore.setAccessToken(accessTokenSsr);
		}
	}, [accessTokenSsr]);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<TanStackQueryProvider>
					<Header />
					{children}
					<TanStackDevtools
						config={{
							position: "bottom-right"
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />
							},
							TanStackQueryDevtools
						]}
					/>
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
