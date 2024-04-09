import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import invariant from "tiny-invariant";
import * as schema from "./schema.server";

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

const turso = createClient({
	url: databaseUrl,
	authToken: authToken,
});

export const db = drizzle(turso, { schema });
