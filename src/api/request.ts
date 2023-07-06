import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axiosRetry from "axios-retry";
import NProgress from "@/config/nprogress";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { AxiosCanceler } from "./helper/axiosCancel";
import { store } from "@/redux";
import { setToken } from "@/redux/modules/global/action";
import { ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { message } from "antd";

const axiosCanceler = new AxiosCanceler();
const whiteRetry = new Set(["ECONNABORTED", undefined, 0]);
// import {baseURL} from '@/utils/variable';

// 创建 axios 请求实例
const serviceAxios = axios.create({
	baseURL: "", // 接口请求地址
	timeout: 15 * 1000, // 请求超时设置
	withCredentials: false, // 跨域请求是否需要携带 cookie
	headers: {
		"Content-Type": "application/json;charset=utf-8"
	},
	validateStatus() {
		// 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
		return true;
	}
});

axiosRetry(serviceAxios, {
	retries: 2, // 重复请求次数
	shouldResetTimeout: true, //  重置超时时间
	retryDelay: retryCount => {
		return retryCount * 10000; // 重复请求延迟
	},
	retryCondition: err => {
		// true为打开自动发送请求，false为关闭自动发送请求
		const { code, message } = err;
		return whiteRetry.has(<string>code) || message.includes("timeout");
	}
});

// 请求拦截器
serviceAxios.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		NProgress.start();
		// * 将当前请求添加到 pending 中
		axiosCanceler.addPending(config);
		// * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
		const token: string = store.getState().global.token;

		if (token) {
			return { ...config, headers: { Authorization: token } };
		}
		return config;
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

// 响应拦截器
serviceAxios.interceptors.response.use(
	(res: AxiosResponse) => {
		const { data, config } = res;
		NProgress.done();
		// * 在请求结束后，移除本次请求(关闭loading)
		axiosCanceler.removePending(config);
		tryHideFullScreenLoading();
		// * 登录失效（code == 599）
		if (data.code == ResultEnum.OVERDUE) {
			store.dispatch(setToken(""));
			message.error("认证失败，无法访问系统资源");
			window.location.hash = "/login";
			return Promise.reject(data);
		}
		// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
		if (data.code && data.code !== ResultEnum.SUCCESS) {
			message.error(data.msg);
			return Promise.reject(data);
		}
		// * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
		return res;
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

// 统一发起请求的函数
async function request<T>(options: AxiosRequestConfig) {
	try {
		const response = await serviceAxios.request<T>(options);
		const { status, data } = response;
		// 处理 HTTP 状态码
		if (status < 200 || status >= 500) {
			return Promise.reject();
		}
		return Promise.resolve(data);
	} catch (error) {
		return Promise.reject(error);
	}
}

export default request;
