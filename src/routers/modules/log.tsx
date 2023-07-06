import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// cesium 模块
const logRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "日志管理"
		},
		children: [
			{
				path: "/log/operlog",
				element: lazyLoad(React.lazy(() => import("@/views/log/operlog/index"))),
				meta: {
					requiresAuth: true,
					title: "操作日志",
					key: "operlog"
				}
			},
			{
				path: "/log/logininfor",
				element: lazyLoad(React.lazy(() => import("@/views/log/logininfor/index"))),
				meta: {
					requiresAuth: true,
					title: "登录日志",
					key: "logininfor"
				}
			}
		]
	}
];

export default logRouter;
