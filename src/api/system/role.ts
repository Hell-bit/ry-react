import { ContentType } from "@/enums/httpEnum";
import request from "../request";

// 查询角色信息列表
export async function getRoleList(params?: API.System.RoleListParams) {
	return request<API.System.RolePageResult>({
		url: "/api/system/role/list",
		method: "GET",
		headers: { "Content-Type": ContentType.FORM_URLENCODED },
		params
	});
}

// 查询角色信息详细
export function getRole(roleId: number) {
	return request<API.System.RoleInfoResult>({
		url: `/api/system/role/${roleId}`,
		method: "GET"
	});
}

// 新增角色信息
export async function addRole(params: API.System.Role) {
	return request<API.Result>({
		url: "/api/system/role",
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		data: params
	});
}

// 修改角色信息
export async function updateRole(params: API.System.Role) {
	return request<API.Result>({
		url: "/api/system/role",
		method: "PUT",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		data: params
	});
}

// 删除角色信息
export async function removeRole(ids: string) {
	return request<API.Result>({
		url: `/api/system/role/${ids}`,
		method: "DELETE"
	});
}

// 导出角色信息
export function exportRole(params?: API.System.RoleListParams) {
	return request<API.Result>({
		url: `/api/system/role/export`,
		method: "post",
		params
	});
}

// 获取角色菜单列表
export function getRoleMenuList(id: number) {
	return request<API.System.RoleMenuResult>({
		url: `/api/system/menu/roleMenuTreeselect/${id}`,
		method: "get"
	});
}

// 角色数据权限
export function updateRoleDataScope(data: Record<string, any>) {
	return request({
		url: "/api/system/role/dataScope",
		method: "put",
		data
	});
}

// 角色状态修改
export function changeRoleStatus(roleId: number, status: string) {
	const data = {
		roleId,
		status
	};
	return request<API.Result>({
		url: "/api/system/role/changeStatus",
		method: "put",
		data: data
	});
}

// 查询角色已授权用户列表
export function allocatedUserList(params?: API.System.RoleListParams) {
	return request({
		url: "/api/system/role/authUser/allocatedList",
		method: "get",
		params
	});
}

// 查询角色未授权用户列表
export function unallocatedUserList(params?: API.System.RoleListParams) {
	return request({
		url: "/api/system/role/authUser/unallocatedList",
		method: "get",
		params
	});
}

// 取消用户授权角色
export function authUserCancel(data: any) {
	return request<API.Result>({
		url: "/api/system/role/authUser/cancel",
		method: "put",
		data: data
	});
}

// 批量取消用户授权角色
export function authUserCancelAll(data: any) {
	return request<API.Result>({
		url: "/api/system/role/authUser/cancelAll",
		method: "put",
		params: data
	});
}

// 授权用户选择
export function authUserSelectAll(data: Record<string, any>) {
	return request<API.Result>({
		url: "/api/system/role/authUser/selectAll",
		method: "put",
		params: data,
		headers: { "Content-Type": ContentType.FORM_URLENCODED }
	});
}

// 根据角色ID查询部门树结构
export function getDeptTreeSelect(roleId: number) {
	return request({
		url: "/api/system/role/deptTree/" + roleId,
		method: "get"
	});
}
