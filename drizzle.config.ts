import type { Config } from "drizzle-kit";
import invariant from "tiny-invariant";

const databaseFile = process.env.DATABASE_FILE;
const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
const databaseMode = process.env.DB_ENV;

let databaseUrl = databaseFile;

if (databaseMode !== "local") {
	databaseUrl = tursoUrl;
	invariant(authToken, "Missing auth token");
}

invariant(databaseUrl, "Missing Database URL");

export default {
	schema: "./app/drizzle/schema.server.ts",
	out: "./app/drizzle/migrations",
	driver: "turso",
	dbCredentials: {
		url: databaseUrl,
		authToken: authToken,
	},
} satisfies Config;
