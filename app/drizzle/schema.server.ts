import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

const stringId = (name: string) =>
	text(name)
		.primaryKey()
		.$defaultFn(() => nanoid());

export type SelectUser = typeof Users.$inferSelect;
export type InsertUser = typeof Users.$inferInsert;
export const Users = sqliteTable("users", {
	id: stringId("id"),
	email: text("email").unique().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const UsersRelations = relations(Users, ({ one }) => ({
	password: one(Passwords, {
		fields: [Users.id],
		references: [Passwords.userId],
	}),
}));

export type SelectPassword = typeof Passwords.$inferSelect;
export type InsertPassword = typeof Passwords.$inferInsert;
export const Passwords = sqliteTable("passwords", {
	id: stringId("id"),
	salt: text("salt").notNull(),
	hash: text("hash").notNull(),
	userId: text("user_id")
		.references(() => Users.id, { onDelete: "cascade" })
		.notNull(),
});

export const PasswordsRelations = relations(Passwords, ({ one }) => ({
	user: one(Users, {
		fields: [Passwords.userId],
		references: [Users.id],
	}),
}));
