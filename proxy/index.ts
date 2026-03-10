import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import cookies from "./config/cookies";
import { serve } from "@hono/node-server";
import { envValues } from "./config/env";

const app = new Hono();

app.get("/pxy/token", (c) => {
	const refreshToken = getCookie(c, cookies.refresh.name) ?? "";
	return c.json({ success: true, data: refreshToken });
});

app.post("/pxy/token", async (c) => {
	const { refreshToken } = await c.req.json();
	setCookie(c, cookies.refresh.name, refreshToken, cookies.refresh.options);
	return c.json({ success: true, data: null });
});

app.delete("/pxy/token", (c) => {
	deleteCookie(c, cookies.refresh.name);
	return c.json({ success: true, data: null });
});

const port = parseInt(envValues.proxyPort);

serve({ fetch: app.fetch, port }, () => {
	console.log(`Proxy running on http://localhost:${port}`);
});
