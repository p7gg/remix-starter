import type { MetaFunction } from "@remix-run/node";
import { Form, useLocation, useSubmit } from "@remix-run/react";
import { useColorScheme } from "~/lib/color-scheme";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	const location = useLocation();
	const submit = useSubmit();
	const colorScheme = useColorScheme();

	return (
		<div>
			<Form
				preventScrollReset
				replace
				action="/_actions/color-scheme"
				method="post"
				className="flex flex-col gap-px"
			>
				<input
					type="hidden"
					name="returnTo"
					value={location.pathname + location.search}
				/>

				<select
					name="colorScheme"
					defaultValue={colorScheme}
					onChange={(e) => {
						submit(e.target.form);
					}}
				>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
					<option value="system">System</option>
				</select>
			</Form>
		</div>
	);
}
