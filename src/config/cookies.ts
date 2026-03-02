import { type CookieSerializeOptions } from "cookie-es";

type cookieConfig = {
	name: string;
	options: CookieSerializeOptions;
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
