import type { LoaderFunction } from "@remix-run/node";
import { requireAuthCookie } from "~/lib/auth.server";

export const loader = (async ({ request }) => {
	await requireAuthCookie(request);
	return null;
}) satisfies LoaderFunction;

export default function Route() {
	return <>Dashboard</>;
}
