import request from "@/api/request";
import { DictValueEnumObj } from "@/components/DictTag";
import { resetUserPwd } from "./User";
/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

// 查询字典类型列表
export async function getDictTypeList(params?: API.DictTypeListParams) {
	// return request<API.DictTypeListParams>(PORT1 + `/system/dict/type/list`, params);
	return request({
		url: `/api/system/dict/type/list`,
		params: {
			...params
		},
		method: "GET",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		}
	});
}

// 查询字典类型详细
export function getDictType(dictId: string) {
	return request({
		url: `/api/system/dict/type/${dictId}`
	});
}

// 查询字典数据详细
export async function getDictValueEnum(dictType: string, isDigital?: boolean): Promise<DictValueEnumObj> {
	const resp = await request<API.System.DictTypeResult>({
		url: `/api/system/dict/data/type/${dictType}`
	});
	if (+resp.code === 200) {
		const opts: DictValueEnumObj = {};
		resp.data.forEach((item: any) => {
			opts[item.dictValue] = {
				text: item.dictLabel,
				label: item.dictLabel,
				value: isDigital ? Number(item.dictValue) : item.dictValue,
				key: item.dictCode,
				listClass: item.listClass,
				status: item.listClass
			};
		});
		return opts;
	} else {
		return {};
	}
}

export async function getDictSelectOption(dictType: string, isDigital?: boolean) {
	const resp = await request<API.System.DictTypeResult>({
		url: `/api/system/dict/data/type/${dictType}`
	});
	if (resp.code === 200) {
		const options: DictValueEnumObj[] = resp.data.map(item => {
			return {
				text: item.dictLabel,
				label: item.dictLabel,
				value: isDigital ? Number(item.dictValue) : item.dictValue,
				key: item.dictCode,
				listClass: item.listClass,
				status: item.listClass
			};
		});
		return options;
	}
	return [];
}

// 新增字典类型
export async function addDictType(params: API.System.DictType) {
	return request<API.Result>({
		url: "/api/system/dict/type",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		data: params
	});
}

// 修改字典类型
export async function updateDictType(params: API.System.DictType) {
	return request<API.Result>({
		url: "/api/system/dict/type",
		method: "PUT",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		data: params
	});
}

// 删除字典类型
export async function removeDictType(ids: string) {
	return request<API.Result>({
		url: `/api/system/dict/type/${ids}`,
		method: "delete"
	});
}

// 导出字典类型
export function exportDictType(params?: API.System.DictTypeListParams) {
	return request<API.Result>({
		url: "/api/system/dict/type/export",
		params
	});
}

// 获取字典选择框列表
export async function getDictTypeOptionSelect(params?: API.DictTypeListParams) {
	return request({
		url: "/api/system/dict/type/optionselect",
		params: {
			...params
		},
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		}
	});
}
