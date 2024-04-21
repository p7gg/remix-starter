import { useNavigation, useRouteLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import type { Loader } from "~/root";
import { useLayoutEffect } from "./primitives";

export type ColorScheme = "dark" | "light" | "system";

export function useColorScheme(): ColorScheme {
	const rootLoaderData = useRouteLoaderData<Loader>("root");
	const rootColorScheme = rootLoaderData?.colorScheme ?? "system";

	const { formData } = useNavigation();
	const optimisticColorScheme = formData?.has("colorScheme")
		? (formData.get("colorScheme") as ColorScheme)
		: null;
	return optimisticColorScheme || rootColorScheme;
}

function syncColorScheme(media: MediaQueryList | MediaQueryListEvent) {
	if (media.matches) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
}

export function ColorSchemeScript() {
	const colorScheme = useColorScheme();
	// This script automatically adds the dark class to the document element if
	// colorScheme is "system" and prefers-color-scheme: dark is true.
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const script = useMemo(
		() => `
        let colorScheme = ${JSON.stringify(colorScheme)};
        if (colorScheme === "system") {
          let media = window.matchMedia("(prefers-color-scheme: dark)")
          if (media.matches) document.documentElement.classList.add("dark");
        }
      `,
		[],
	);

	// Set
	useLayoutEffect(() => {
		switch (colorScheme) {
			case "light": {
				document.documentElement.classList.remove("dark");
				break;
			}
			case "dark": {
				document.documentElement.classList.add("dark");
				break;
			}
			case "system": {
				const media = window.matchMedia("(prefers-color-scheme: dark)");
				syncColorScheme(media);
				media.addEventListener("change", syncColorScheme);
				return () => media.removeEventListener("change", syncColorScheme);
			}
			default:
				console.error("Impossible color scheme state:", colorScheme);
		}
	}, [colorScheme]);

	// always sync the color scheme if "system" is used
	// this accounts for the docs pages adding some classnames to documentElement in root
	useLayoutEffect(() => {
		if (colorScheme === "system") {
			const media = window.matchMedia("(prefers-color-scheme: dark)");
			syncColorScheme(media);
		}
	});

	// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
	return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
