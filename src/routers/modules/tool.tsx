import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// cesium 模块
const cesiumRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "系统工具"
		},
		children: [
			{
				path: "/tool/build",
				element: lazyLoad(React.lazy(() => import("@/views/tool/build/index"))),
				meta: {
					requiresAuth: true,
					title: "表单构建",
					key: "build"
				}
			},
			{
				path: "/tool/gen",
				element: lazyLoad(React.lazy(() => import("@/views/tool/gen/index"))),
				meta: {
					requiresAuth: true,
					title: "代码生成",
					key: "gen"
				}
			},
			{
				path: "/tool/gen/import",
				element: lazyLoad(React.lazy(() => import("@/views/tool/gen/import"))),
				meta: {
					requiresAuth: false,
					title: "导入",
					key: "import"
				}
			},
			{
				path: "/tool/swagger",
				element: lazyLoad(React.lazy(() => import("@/views/tool/swagger/index"))),
				meta: {
					requiresAuth: true,
					title: "系统接口",
					key: "swagger"
				}
			}
		]
	}
];

export default cesiumRouter;
