import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "~/drizzle/db.server";
import { Passwords, Users } from "~/drizzle/schema.server";

export async function getUserFromEmail(email: string) {
	const query = db.query.Users.findFirst({
		where: (Table, { eq }) => eq(Table.email, sql.placeholder("email")),
		columns: { id: true },
	}).prepare();

	return query.execute({ email });
}

export async function createUser(payload: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}) {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto
		.pbkdf2Sync(payload.password, salt, 1000, 64, "sha256")
		.toString("hex");

	return db.transaction(async (tx) => {
		const userQuery = tx
			.insert(Users)
			.values({
				email: sql.placeholder("email"),
				firstName: sql.placeholder("firstName"),
				lastName: sql.placeholder("lastName"),
			})
			.returning({ id: Users.id })
			.prepare();
		const passwordQuery = tx
			.insert(Passwords)
			.values({
				hash: sql.placeholder("hash"),
				salt: sql.placeholder("salt"),
				userId: sql.placeholder("userId"),
			})
			.prepare();

		const [user] = await userQuery.execute({
			email: payload.email,
			firstName: payload.firstName,
			lastName: payload.lastName,
		});

		if (!user) {
			tx.rollback();
			return;
		}

		await passwordQuery.execute({ hash, salt, userId: user.id });
	});
}
