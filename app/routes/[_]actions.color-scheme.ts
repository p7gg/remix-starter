import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import {
	serializeColorScheme,
	validateColorScheme,
} from "~/lib/color-scheme.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const colorScheme = formData.get("colorScheme");

	if (!validateColorScheme(colorScheme)) {
		throw new Response("Bad Request", { status: 400 });
	}

	const redirectTo = String(formData.get("returnTo")) || "/";

	return redirect(redirectTo, {
		headers: { "Set-Cookie": await serializeColorScheme(colorScheme) },
	});
}
