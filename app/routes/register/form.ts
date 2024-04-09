import { useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { z } from "zod";

export type RegisterSchema = z.output<typeof RegisterSchema>;
export const RegisterSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
		firstName: z.string().min(1),
		lastName: z.string().min(1),
	})
	.refine((values) => values.password === values.confirmPassword, {
		message: "Passwords does not match",
		path: ["confirmPassword"],
	});

export function useRegisterForm(
	options?: Parameters<typeof useForm<RegisterSchema>>[0],
) {
	return useForm({
		...options,
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
		constraint: getZodConstraint(RegisterSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, { schema: RegisterSchema });
			return parsed;
		},
	});
}
