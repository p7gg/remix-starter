import "./globals.css";

import { type LoaderFunction, json } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { ColorSchemeScript, useColorScheme } from "./lib/color-scheme";
import { parseColorScheme } from "./lib/color-scheme.server";

export type Loader = typeof loader;
export const loader = (async ({ request }) => {
	const colorScheme = await parseColorScheme(request);

	return json({ colorScheme });
}) satisfies LoaderFunction;

function Document(props: { children: React.ReactNode }) {
	const colorScheme = useColorScheme();

	return (
		<html lang="en" className={`${colorScheme === "dark" ? "dark" : ""}`}>
			<head>
				<ColorSchemeScript />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{props.children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	);
}
