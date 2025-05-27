import "reflect-metadata";
import Container, { Service } from "typedi";
import type { InteraMiddleware } from "../types/router.types";
import { Intera__RouterCache } from "../caches/RouterCache";

const CONTROLLER_KEY = Symbol("INTERA_CONTROLLER");

export function Controller(path?: string, middlewares?: InteraMiddleware[]) {
  return <TFunction extends Function>(ctor: TFunction) => {
    Service()(ctor);
    Reflect.defineMetadata(CONTROLLER_KEY, path, ctor);
    if (middlewares && path) {
      const routerCache = Container.get(Intera__RouterCache);
      routerCache.setMiddleware(path, middlewares || []);
    }
  };
}

export function getControllerRoute(target: object) {
  return Reflect.getMetadata(CONTROLLER_KEY, target);
}
