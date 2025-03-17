import type { Type } from "arktype";
import type { FastifyRequest, FastifyReply } from "fastify";

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
  middlewares?: RouterMiddleware[];
  input?: unknown;
  output?: unknown;
  schemas?: [Type<unknown>, Type<unknown>];
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

export type RouterMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
) => void;

export interface InteraRequest extends FastifyRequest {
  params: Record<string, string>;
  body: Record<string, unknown>;
  query: Record<string, string>;
  cookies: Record<string, string>;
}

export interface InteraReply extends FastifyReply {}
