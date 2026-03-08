import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccessTokenStore } from "@/store/accessTokenStore";

let context:
	| {
			queryClient: QueryClient;
	  }
	| undefined;

export function getContext() {
	if (context) return context;

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: (query) => {
					const isPublic = query.meta?.public === true;
					const accessToken = useAccessTokenStore.getState().accessToken;
					return isPublic || !!accessToken;
				},
				staleTime: Infinity,
				gcTime: Infinity
			}
		}
	});

	context = {
		queryClient
	};

	return context;
}

export default function TanStackQueryProvider({ children }: { children: ReactNode }) {
	const { queryClient } = getContext();

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
