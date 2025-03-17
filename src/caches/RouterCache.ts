import { Service } from "typedi";
import type {
  RouterCacheRecord,
  RouterCacheRecordPatchable,
} from "../types/router.types";
import { ArkErrors, type Type } from "arktype";
import { routeCacheItem } from "../schemas/routeCache.schema";

@Service()
export class Intera__RouterCache {
  private routeCache: Map<string, Partial<RouterCacheRecord>> = new Map();

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

  public setSchemas(key: string, value: [Type<unknown>, Type<unknown>]) {
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

  public getAllRoutes(): RouterCacheRecord[] {
    const routeCacheRecords: RouterCacheRecord[] = [];
    for (const [_key, value] of this.routeCache) {
      const isValid = routeCacheItem(value);
      const isError = isValid instanceof ArkErrors;
      if (!isError) {
        routeCacheRecords.push(isValid);
      }
    }
    return routeCacheRecords;
  }
}
