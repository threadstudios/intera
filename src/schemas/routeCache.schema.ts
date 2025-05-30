import z from "zod/v4";

export const routeCacheItemSchema = z.object({
	route: z.string(),
	target: z.object(),
	method: z.enum([
		"get",
		"post",
		"put",
		"delete",
		"patch",
		"options",
		"head",
		"*",
	]),
});
