import { match, P } from "ts-pattern";
import type { InteraReply, InteraRequest } from "../../types/router.types";

const params = [
  {
    name: "body",
    hasArgs: true,
    fetcher: (req: InteraRequest, id?: string) =>
      id !== undefined ? req.body[id] : req.body,
  },
  {
    name: "req",
    hasArgs: false,
    fetcher: (req: InteraRequest) => req,
  },
  {
    name: "res",
    hasArgs: false,
    fetcher: (res: InteraRequest) => res,
  },
  {
    name: "query",
    hasArgs: true,
    fetcher: (req: InteraRequest, id?: string) =>
      id !== undefined ? req.query[id] : req.query,
  },
  {
    name: "params",
    hasArgs: true,
    fetcher: (req: InteraRequest, id?: string) =>
      id !== undefined ? req.params[id] : req.params,
  },
  {
    name: "cookie",
    hasArgs: true,
    fetcher: (req: InteraRequest, id?: string) => {
      return id !== undefined ? req.cookies[id] : req.cookies;
    },
  },
];

function createParamDecorator(name: string, hasArgs: boolean) {
  return (...args: unknown[]) =>
    (target: object, propertyKey: string | symbol, parameterIndex: number) => {
      const existingParameters: unknown[] =
        Reflect.getOwnMetadata(`${name}Parameters`, target, propertyKey) || [];
      existingParameters.push(
        hasArgs
          ? { index: parameterIndex, name: args[0] }
          : { index: parameterIndex }
      );
      Reflect.defineMetadata(
        `${name}Parameters`,
        existingParameters,
        target,
        propertyKey
      );
    };
}

export function extractAllParams(
  target: object,
  propertyKey: string | symbol,
  args: unknown[],
  request: InteraRequest,
  reply: InteraReply
) {
  for (const { name, fetcher, hasArgs } of params) {
    const parameters: { index: number; name: string }[] =
      Reflect.getOwnMetadata(`${name}Parameters`, target, propertyKey) || [];
    for (const param of parameters) {
      match(name)
        .with(P.union("body", "query", "params"), () => {
          args[param.index] = hasArgs
            ? fetcher(request, param.name)
            : fetcher(request);
        })
        .with("req", () => {
          args[param.index] = request;
        })
        .with("res", () => {
          args[param.index] = reply;
        });
    }
  }
}

export const Body = createParamDecorator("body", true);
export const Query = createParamDecorator("query", true);
export const Param = createParamDecorator("params", true);
export const Cookie = createParamDecorator("cookie", true);
export const Req = createParamDecorator("req", false);
export const Res = createParamDecorator("res", false);
