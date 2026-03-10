import type { CookieOptions } from "hono/utils/cookie";

type cookieConfig = {
	name: string;
	options: CookieOptions;
};

const cookies = {
	refresh: {
		name: "refreshToken",
		options: {
			httpOnly: true,
			secure: true,
			path: "/",
			maxAge: 60 * 60 * 24 * 30 // 30 days
		}
	}
} satisfies Record<string, cookieConfig>;

export default cookies;
