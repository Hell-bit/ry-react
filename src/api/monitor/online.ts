import request from "../request";

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

// 查询在线用户列表
export async function getOnlineUserList(params?: API.Monitor.OnlineUserListParams) {
	return request<API.Monitor.OnlineUserPageResult>({
		url: "/api/monitor/online/list",
		method: "GET",
		params
	});
}

// 强退用户
export async function forceLogout(tokenId: string) {
	return request({
		url: `/api/monitor/online/${tokenId}`,
		method: "DELETE"
	});
}
