import request from "../request";

// 查询缓存名称列表
export function listCacheName() {
	return request<API.Monitor.CacheNamesResponse>({
		url: "/api/monitor/cache/getNames",
		method: "get"
	});
}

// 查询缓存键名列表
export function listCacheKey(cacheName: string) {
	return request<API.Monitor.CacheKeysResponse>({
		url: "/api/monitor/cache/getKeys/" + cacheName,
		method: "get"
	});
}

// 查询缓存内容
export function getCacheValue(cacheName: string, cacheKey: string) {
	return request<API.Monitor.CacheValueResponse>({
		url: "/api/monitor/cache/getValue/" + cacheName + "/" + cacheKey,
		method: "get"
	});
}

// 清理指定名称缓存
export function clearCacheName(cacheName: string) {
	return request<API.Result>({
		url: "/api/monitor/cache/clearCacheName/" + cacheName,
		method: "delete"
	});
}

// 清理指定键名缓存
export function clearCacheKey(cacheKey: string) {
	return request<API.Result>({
		url: "/api/monitor/cache/clearCacheKey/" + cacheKey,
		method: "delete"
	});
}

// 清理全部缓存
export function clearCacheAll() {
	return request<API.Result>({
		url: "/api/monitor/cache/clearCacheAll",
		method: "delete"
	});
}
