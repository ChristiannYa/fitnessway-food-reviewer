import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Header from "../components/layout/Header";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { refreshAccessTokenServerFn } from "@/server/authServerFns";
import { useEffect } from "react";
import { useAccessTokenStore } from "@/store/accessTokenStore";

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
		const accessTokenStore = useAccessTokenStore.getState();

		if (!accessTokenStore.accessToken) {
			const res = await refreshAccessTokenServerFn();
			if (res.data) accessTokenStore.save(res.data.accessToken);
		}

		return {
			accessTokenSsr: useAccessTokenStore.getState().accessToken
		};
	},
	notFoundComponent: () => <p>404 - Page not found</p>,
	shellComponent: RootDocument
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { accessTokenSsr } = Route.useRouteContext();

	// Single subscription causes `RootDocument` to re-render when token changes,
	// which propagates fown and causes all queries to re-evaulate `enabled`
	useAccessTokenStore((s) => s.accessToken);

	// The root route's `beforeLoad()` runs on the server, so the acess token that is
	// refreshed is stored in the server's `AccessTokenStore` instance, not the browser's.
	//
	// Here we bridge that gap by seeding the browser's store with the token passed down
	// through the router context, which TanStack Start serializes into the HTML.
	//
	// This runs once on hydration.
	// Because the store is reactive (Zustand), setting the token here triggers a re-render,
	// which causes `QueryClient`'s `enabled` check to re-evaulate and allows authenticated
	// queries to fire
	useEffect(() => {
		const accessToken = useAccessTokenStore.getState().accessToken;

		if (accessTokenSsr && !accessToken) {
			useAccessTokenStore.getState().save(accessTokenSsr);
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
