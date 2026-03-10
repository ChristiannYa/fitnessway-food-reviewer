import { envValues } from "./env";
import { cors } from "hono/cors";

export const appCors = () =>
	cors({
		origin: envValues.appUrl,
		allowMethods: ["GET", "POST", "DELETE"],
		allowHeaders: ["Content-Type"],
		credentials: true
	});
