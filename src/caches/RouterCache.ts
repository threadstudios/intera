import { Service } from "typedi";
import { ZodType, safeParse } from "zod/v4";
import { routeCacheItemSchema } from "../schemas/routeCache.schema";
import type {
  InteraMiddleware,
  RouterCacheRecord,
  RouterCacheRecordPatchable,
} from "../types/router.types";

@Service()
export class Intera__RouterCache {
  private routeCache: Map<string, Partial<RouterCacheRecord>> = new Map();
  private middlewareCache: Map<string, InteraMiddleware[]> = new Map();

  public getRoute(key: string) {
    return this.routeCache.get(key);
  }

  public setRoute(key: string, value: Partial<RouterCacheRecord>) {
    const existing = this.routeCache.get(key);
    this.routeCache.set(key, {
      ...existing,
      ...value,
    });
  }

  public setMiddleware(key: string, value: InteraMiddleware[]) {
    const existing = this.middlewareCache.get(key);
    if (existing) {
      this.middlewareCache.set(key, [...existing, ...value]);
    } else {
      this.middlewareCache.set(key, value);
    }
  }

  public setSchemas(key: string, value: [ZodType | undefined | null, ZodType]) {
    this.setRoute(key, {
      schemas: value,
    });
  }

  public patchRoute(key: string, value: RouterCacheRecordPatchable) {
    const existing = this.routeCache.get(key);
    if (!existing) {
      throw new Error(`Route ${key} does not exist in cache`);
    }
    this.routeCache.set(key, {
      ...existing,
      ...value,
    });
  }

  public hasRoute(key: string) {
    return this.routeCache.has(key);
  }

  public getControllerMiddlewares(path: string): InteraMiddleware[] {
    const middlewares = this.middlewareCache.get(path);
    if (middlewares) {
      return middlewares;
    }
    return [];
  }

  public getAllRoutes(): RouterCacheRecord[] {
    const routeCacheRecords: RouterCacheRecord[] = [];
    for (const [_key, value] of this.routeCache) {
      const routeParsed = safeParse(routeCacheItemSchema, value);
      if (!routeParsed.error) {
        routeCacheRecords.push(value as RouterCacheRecord);
        break;
      }
      console.error(`Error parsing route:\r\n${JSON.stringify(value)}`);
    }
    return routeCacheRecords;
  }
}
