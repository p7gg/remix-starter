import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const isProduction = process.env.NODE_ENV === "production";
const cookieSecret = process.env.COOKIE_SECRET || "s3cr3t";

if (cookieSecret === "s3cr3t") {
	console.warn("⚠️ cookie secret not safe");
}

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "theme",
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secrets: [cookieSecret],
		...(isProduction
			? {
					// domain: "your-production-domain.com",
					secure: true,
				}
			: {}),
	},
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
