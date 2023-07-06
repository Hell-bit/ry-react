import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// cesium 模块
const systemRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "系统管理"
		},
		children: [
			{
				path: "/system/menu",
				element: lazyLoad(React.lazy(() => import("@/views/system/menu/index"))),
				meta: {
					requiresAuth: true,
					title: "菜单管理",
					key: "menu"
				}
			},
			{
				path: "/system/dict",
				element: lazyLoad(React.lazy(() => import("@/views/system/dict/index"))),
				meta: {
					requiresAuth: true,
					title: "字典管理",
					key: "dict"
				}
			},
			{
				path: "/system/dict-data/index/:id",
				element: lazyLoad(React.lazy(() => import("@/views/system/dictData/index"))),
				meta: {
					requiresAuth: false,
					title: "字典明细",
					key: "dictdata"
				}
			},
			{
				path: "/system/user",
				element: lazyLoad(React.lazy(() => import("@/views/system/user/index"))),
				meta: {
					requiresAuth: true,
					title: "用户管理",
					key: "user"
				}
			},
			{
				path: "/system/role",
				element: lazyLoad(React.lazy(() => import("@/views/system/role/index"))),
				meta: {
					requiresAuth: true,
					title: "角色管理",
					key: "role"
				}
			},
			{
				path: "/system/role-auth/user/:id",
				element: lazyLoad(React.lazy(() => import("@/views/system/role/authUser"))),
				meta: {
					requiresAuth: true,
					title: "分配用户",
					key: "authUser"
				}
			},
			{
				path: "/system/dept",
				element: lazyLoad(React.lazy(() => import("@/views/system/dept/index"))),
				meta: {
					requiresAuth: true,
					title: "部门管理",
					key: "dept"
				}
			},
			{
				path: "/system/post",
				element: lazyLoad(React.lazy(() => import("@/views/system/post/index"))),
				meta: {
					requiresAuth: true,
					title: "岗位管理",
					key: "post"
				}
			},
			{
				path: "/system/config",
				element: lazyLoad(React.lazy(() => import("@/views/system/config/index"))),
				meta: {
					requiresAuth: true,
					title: "参数设置",
					key: "config"
				}
			},
			{
				path: "/system/notice",
				element: lazyLoad(React.lazy(() => import("@/views/system/notice/index"))),
				meta: {
					requiresAuth: true,
					title: "通知公告",
					key: "notice"
				}
			},
			{
				path: "/system/log/operlog",
				element: lazyLoad(React.lazy(() => import("@/views/system/log/operlog/index"))),
				meta: {
					requiresAuth: true,
					title: "操作日志",
					key: "operlog"
				}
			},
			{
				path: "/system/log/logininfor",
				element: lazyLoad(React.lazy(() => import("@/views/system/log/logininfor/index"))),
				meta: {
					requiresAuth: true,
					title: "登录日志",
					key: "logininfor"
				}
			}
		]
	}
];

export default systemRouter;
