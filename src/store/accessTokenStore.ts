import { create } from "zustand";

type AccessTokenState = {
	accessToken: string | null;
};

type AccessTokenActions = {
	save: (token: string) => void;
	remove: () => void;
};

export const useAccessTokenStore = create<AccessTokenState & AccessTokenActions>(
	(set) => ({
		accessToken: null,
		save: (token) => set({ accessToken: token }),
		remove: () => set({ accessToken: null })
	})
);
