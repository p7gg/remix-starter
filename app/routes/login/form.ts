import { useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { z } from "zod";

export type LoginSchema = z.output<typeof LoginSchema>;
export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export function useLoginForm(
	options?: Parameters<typeof useForm<LoginSchema>>[0],
) {
	return useForm({
		...options,
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
		constraint: getZodConstraint(LoginSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, { schema: LoginSchema });
			return parsed;
		},
	});
}
