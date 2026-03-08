import "@tanstack/react-query";

declare module "@tanstack/react-query" {
	interface Register {
		queryMeta: {
			public?: boolean;
		};
		mutationMeta: {
			public?: boolean;
		};
	}
}
