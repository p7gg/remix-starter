import { parseWithZod } from "@conform-to/zod";
import {
	type ActionFunction,
	type LoaderFunction,
	redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/sessions.server";
import { LoginSchema, useLoginForm } from "./form";
import { loginUser } from "./queries";

export const loader = (({ request }) => {
	return redirectIfLoggedInLoader(request);
}) satisfies LoaderFunction;

export default function Route() {
	const action = useActionData<Action>();

	const [form, fields] = useLoginForm({ lastResult: action });

	return (
		<Form method="post" id={form.id} onSubmit={form.onSubmit}>
			<input type="email" placeholder="email" name={fields.email.name} />
			<input
				type="password"
				placeholder="password"
				name={fields.password.name}
			/>

			<button type="submit">Login</button>
		</Form>
	);
}

export type Action = typeof action;
export const action = (async ({ request }) => {
	const formData = await request.formData();

	const submission = parseWithZod(formData, { schema: LoginSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}

	const userId = await loginUser(submission.value);

	if (!userId) {
		return submission.reply({
			formErrors: ["Invalid credentials"],
		});
	}

	throw setAuthOnResponse(redirect("/dashboard"), userId);
}) satisfies ActionFunction;
