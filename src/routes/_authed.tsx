import { accessTokenStore } from "@/store/accessTokenStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
    beforeLoad: () => {
        if (!accessTokenStore.getAccessToken()) {
            throw redirect({ to: "/login" });
        }
    },
    component: () => <Outlet />
});