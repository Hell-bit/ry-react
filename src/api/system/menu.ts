import qs from "qs";

import http from "@/api";
import request from "@/api/request";
// 查询菜单权限列表
export async function getMenuList(params?: API.System.MenuListParams, options?: { [key: string]: any }) {
	return request<API.System.MenuPageResult>({
		url: "/api/system/menu/list",
		method: "GET",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		params,
		...(options || {})
	});
}
// 查询菜单权限列表
export async function getMenutoList(params?: API.System.MenuListParams, options?: { [key: string]: any }) {
	return http.get<API.System.MenuPageResult>("/system/menu/list", {
		// params,
		...(options || {})
	});
}

// 查询菜单权限详细
export function getMenu(menuId: number, options?: { [key: string]: any }) {
	return http.get<API.System.MenuInfoResult>(`/system/menu/${menuId}`, {
		...(options || {})
	});
}

// 新增菜单权限
export async function addMenu(params: API.System.Menu, options?: { [key: string]: any }) {
	return request<API.Result>({ url: "/api/system/menu", method: "post", data: params });
}

// 修改菜单权限
export async function updateMenu(params: any, options?: { [key: string]: any }) {
	return request<API.Result>({
		method: "put",
		url: "/api/system/menu",
		data: params
	});
}

// 删除菜单权限
export async function removeMenu(ids: string) {
	return request<API.Result>({
		url: `/api/system/menu/${ids}`,
		method: "delete"
	});
}

// 导出菜单权限
export function exportMenu(params?: API.System.MenuListParams, options?: { [key: string]: any }) {
	return http.get<API.Result>(`/system/menu/export`, {
		params,
		...(options || {})
	});
}

// 查询菜单权限详细
export function getMenuTree() {
	return http.get("/system/menu/treeselect", {
		method: "GET"
	});
}
