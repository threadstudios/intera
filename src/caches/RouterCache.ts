import { Service } from "typedi";
import { ZodAny, parse, safeParse } from "zod/v4";
import { routeCacheItemSchema } from "../schemas/routeCache.schema";
import type {
	RouterCacheRecord,
	RouterCacheRecordPatchable,
} from "../types/router.types";

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

	public setSchemas(key: string, value: [ZodAny, ZodAny]) {
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
			const routeParsed = safeParse(routeCacheItemSchema, value);
			if (!routeParsed.error) {
				routeCacheRecords.push(value as RouterCacheRecord);
			}
		}
		return routeCacheRecords;
	}
}
