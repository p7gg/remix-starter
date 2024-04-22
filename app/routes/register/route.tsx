import { parseWithZod } from "@conform-to/zod";
import {
	type ActionFunction,
	type LoaderFunction,
	redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { redirectIfLoggedInLoader } from "~/lib/auth.server";
import { RegisterSchema, useRegisterForm } from "./form";
import { createUser, getUserFromEmail } from "./queries";

export type Loader = typeof loader;
export const loader = (({ request }) => {
	return redirectIfLoggedInLoader(request);
}) satisfies LoaderFunction;

export default function Route() {
	const action = useActionData<Action>();

	const [form, fields] = useRegisterForm({ lastResult: action });

	return (
		<Form method="post" id={form.id} onSubmit={form.onSubmit}>
			<input type="email" placeholder="email" name={fields.email.name} />
			<input
				type="password"
				placeholder="password"
				name={fields.password.name}
			/>
			<input
				type="password"
				placeholder="confirm password"
				name={fields.confirmPassword.name}
			/>
			<input
				type="text"
				placeholder="first name"
				name={fields.firstName.name}
			/>
			<input type="text" placeholder="last name" name={fields.lastName.name} />

			<button type="submit">Register</button>
		</Form>
	);
}

export type Action = typeof action;
export const action = (async ({ request }) => {
	const formData = await request.formData();

	const submission = parseWithZod(formData, { schema: RegisterSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}

	const user = await getUserFromEmail(submission.value.email);
	if (user) {
		return submission.reply({ formErrors: ["Email already been used"] });
	}

	await createUser(submission.value);

	throw redirect("/login");
}) satisfies ActionFunction;
