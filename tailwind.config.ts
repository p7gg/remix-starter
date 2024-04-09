import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [
		iconsPlugin({
			collections: getIconCollections(["lucide"]),
		}),
	],
} satisfies Config;
