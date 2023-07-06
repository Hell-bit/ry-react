import request from "../request";

// 查询定时任务调度日志列表
export async function getJobLogList(params?: API.Monitor.JobLogListParams) {
	return request<API.Monitor.JobLogPageResult>({
		url: "/api/monitor/jobLog/list",
		method: "GET",
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		params
	});
}

// 删除定时任务调度日志
export async function removeJobLog(jobLogId: string) {
	return request<API.Result>({
		url: `/api/monitor/jobLog/${jobLogId}`,
		method: "DELETE"
	});
}

// 清空调度日志
export function cleanJobLog() {
	return request({
		url: "/api/monitor/jobLog/clean",
		method: "delete"
	});
}

// 导出定时任务调度日志
export function exportJobLog(params?: API.Monitor.JobLogListParams) {
	return request<API.Result>({
		url: `/api/monitor/jobLog/export`,
		method: "GET",
		params
	});
}
