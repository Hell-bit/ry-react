import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";

// cesium 模块
const cesiumRouter: Array<RouteObject> = [
	{
		path: "/cesium/map",
		element: lazyLoad(React.lazy(() => import("@/views/cesium/map/index"))),
		meta: {
			requiresAuth: true,
			title: "地图",
			key: "map"
		}
	}
];

export default cesiumRouter;
