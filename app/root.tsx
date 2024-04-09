import "./globals.css";

import type { LoaderFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import {
	PreventFlashOnWrongTheme,
	ThemeProvider,
	useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./sessions.server";

export type Loader = typeof loader;
export const loader = (async ({ request }) => {
	const { getTheme } = await themeSessionResolver(request);

	return {
		theme: getTheme(),
	};
}) satisfies LoaderFunction;

export default function AppWithProviders() {
	const { theme } = useLoaderData<Loader>();

	return (
		<ThemeProvider specifiedTheme={theme} themeAction="/api/set-theme">
			<App />
		</ThemeProvider>
	);
}

function App() {
	const data = useLoaderData<Loader>();
	const [theme] = useTheme();

	return (
		<html lang="en" className={theme ?? undefined}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
