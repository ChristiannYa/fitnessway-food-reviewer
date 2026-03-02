import {
	HeadContent,
	Scripts,
	createRootRouteWithContext
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Header from "../components/Header";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { accessTokenStore } from "@/store/accessTokenStore";
import { refreshAccessTokenServerFn } from "@/server/authServerFns";

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
	},
	notFoundComponent: () => <p>404 - Page not found</p>,
	shellComponent: RootDocument
});

function RootDocument({ children }: { children: React.ReactNode }) {
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
