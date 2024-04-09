import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "~/drizzle/db.server";

export async function loginUser(payload: { email: string; password: string }) {
	const userQuery = db.query.Users.findFirst({
		columns: { id: true, email: true },
		with: { password: { columns: { hash: true, salt: true } } },
		where: (Table, { eq }) => eq(Table.email, sql.placeholder("email")),
	}).prepare();

	const user = await userQuery.execute({ email: payload.email });

	if (!user) return;

	const hash = crypto
		.pbkdf2Sync(payload.password, user.password.salt, 1000, 64, "sha256")
		.toString("hex");

	if (hash !== user.password.hash) return;

	return user.id;
}
