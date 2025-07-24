import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodType } from "zod/v4";

export type RouterCacheRecord = {
  route: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handler?: any;
  target: object;
  parent?: object;
  method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head";
  middlewares?: InteraMiddleware[];
  input?: unknown;
  output?: unknown;
  schemas?: [ZodType | undefined, ZodType];
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
}

export abstract class InteraMiddlewareClass {
  abstract run(request: InteraRequest, reply: InteraReply): Promise<void>;
}

// biome-ignore lint/suspicious/noExplicitAny: We don't know what DI arguments are in each middleware
export type InteraMiddleware = new (...args: any[]) => InteraMiddlewareClass;

export interface InteraRequestContext<RC extends Record<string, unknown> = {}> {
  get<K extends keyof RC>(key: K): RC[K] | undefined;
  set<K extends keyof RC>(key: K, value: RC[K]): void;
  getStore(): RC | undefined;
}

export interface InteraRequest<RC extends Record<string, unknown> = {}>
  extends FastifyRequest {
  params: Record<string, string>;
  body: Record<string, unknown>;
  query: Record<string, string>;
  cookies: Record<string, string>;
  requestContext: InteraRequestContext<RC>;
}

export interface InteraReply extends FastifyReply {}
