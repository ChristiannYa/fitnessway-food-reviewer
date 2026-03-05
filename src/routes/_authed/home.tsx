import { Home } from "@/components/app/home/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/home")({
	component: Home
});
