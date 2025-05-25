import type { FastifyReply, FastifyRequest } from "fastify";
import { Token } from "typedi";
import { ZodAny } from "zod/v4";

export type RouterCacheRecord = {
	route: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	handler?: any;
	target: object;
	parent?: object;
	method:
		| "get"
		| "post"
		| "put"
		| "delete"
		| "patch"
		| "options"
		| "head"
		| "*";
	middlewares?: Token<unknown>[];
	input?: unknown;
	output?: unknown;
	schemas?: [ZodAny, ZodAny];
};

export type RouterCacheRecordPatchable = {
	input: unknown;
	ouput: unknown;
};

export enum RestMethods {
	Get = "get",
	Post = "post",
	Put = "put",
	Delete = "delete",
	Patch = "patch",
	Options = "options",
	Head = "head",
	All = "*",
}

export interface InteraMiddleware {
	run: (request: InteraRequest, reply: InteraReply) => Promise<void>;
}

export interface InteraRequest extends FastifyRequest {
	params: Record<string, string>;
	body: Record<string, unknown>;
	query: Record<string, string>;
	cookies: Record<string, string>;
}

export interface InteraReply extends FastifyReply {}
