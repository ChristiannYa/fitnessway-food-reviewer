import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/layout/Header";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import type { QueryClient } from "@tanstack/react-query";
import { useInitAuth } from "@/hooks/useInitAuth";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	notFoundComponent: () => <p>404 - Page not found</p>,
	component: RootDocument
});

function RootDocument() {
	useInitAuth();

	return (
		<TanStackQueryProvider>
			<Header />
			<Outlet />
			<TanStackRouterDevtools />
		</TanStackQueryProvider>
	);
}
