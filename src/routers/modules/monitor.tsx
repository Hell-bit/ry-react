import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// cesium 模块
const monitorRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "系统监控"
		},
		children: [
			{
				path: "/monitor/online",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/online/index"))),
				meta: {
					requiresAuth: true,
					title: "在线用户",
					key: "online"
				}
			},
			{
				path: "/monitor/job",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/job/index"))),
				meta: {
					requiresAuth: true,
					title: "定时任务",
					key: "job"
				}
			},
			{
				path: "/monitor/job-log/:id",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/jobLog/index"))),
				meta: {
					requiresAuth: true,
					title: "任务日志",
					key: "job"
				}
			},
			{
				path: "/monitor/druid",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/druid/index"))),
				meta: {
					requiresAuth: true,
					title: "数据监控",
					key: "druid"
				}
			},
			{
				path: "/monitor/server",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/server/index"))),
				meta: {
					requiresAuth: true,
					title: "服务监控",
					key: "server"
				}
			},
			{
				path: "/monitor/cache",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/cache/index"))),
				meta: {
					requiresAuth: true,
					title: "缓存监控",
					key: "cache"
				}
			},
			{
				path: "/monitor/cache/list",
				element: lazyLoad(React.lazy(() => import("@/views/monitor/cache/list/index"))),
				meta: {
					requiresAuth: true,
					title: "缓存列表",
					key: "cachelist"
				}
			}
		]
	}
];

export default monitorRouter;
