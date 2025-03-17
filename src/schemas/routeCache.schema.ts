import { type } from "arktype";

export const routeCacheItem = type({
  route: "string",
  target: {},
  method:
    "'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | '*'",
});
