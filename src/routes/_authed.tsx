import { useAccessTokenStore } from "@/store/accessTokenStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	beforeLoad: () => {
		const accessToken = useAccessTokenStore.getState().accessToken;
		if (!accessToken) {
			throw redirect({ to: "/login" });
		}
	},
	component: () => <Outlet />
});
