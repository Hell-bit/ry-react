import request from "../request";
// 获取服务器信息
export async function getServerInfo() {
  return request({
		url:'/api/monitor/server', 
    method: 'GET',
  });
}
