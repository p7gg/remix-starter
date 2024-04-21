import { createCookie, redirect } from "@remix-run/node";

const isProduction = process.env.NODE_ENV === "production";
const cookieSecret = process.env.COOKIE_SECRET || "s3cr3t";

if (cookieSecret === "s3cr3t") {
	console.warn("⚠️ cookie secret not safe");
}

const cookie = createCookie("auth", {
	secrets: [cookieSecret],
	maxAge: 30 * 24 * 60 * 60, // 30 days
	httpOnly: true,
	...(isProduction
		? {
				// domain: "your-production-domain.com",
				secure: true,
			}
		: {}),
	sameSite: "lax",
});

export async function getAuthFromRequest(
	request: Request,
): Promise<string | null> {
	const userId = await cookie.parse(request.headers.get("Cookie"));
	return userId ?? null;
}

export async function setAuthOnResponse(
	response: Response,
	userId: string,
): Promise<Response> {
	const header = await cookie.serialize(userId);
	response.headers.append("Set-Cookie", header);
	return response;
}

export async function requireAuthCookie(request: Request) {
	const userId = await getAuthFromRequest(request);
	if (!userId) {
		throw redirect("/login", {
			headers: {
				"Set-Cookie": await cookie.serialize("", {
					maxAge: 0,
				}),
			},
		});
	}
	return userId;
}

export async function redirectIfLoggedInLoader(request: Request) {
	const userId = await getAuthFromRequest(request);
	if (userId) {
		throw redirect("/dashboard");
	}
	return null;
}

export async function redirectWithClearedCookie(): Promise<Response> {
	return redirect("/", {
		headers: {
			"Set-Cookie": await cookie.serialize(null, {
				expires: new Date(0),
			}),
		},
	});
}
