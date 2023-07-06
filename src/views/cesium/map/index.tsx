import React, { useState, useEffect } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./index.less";

const Map: React.FC = () => {
	const [tk, setTk] = useState("894e8a275f109a0317d8c77609ccf603");
	// const marsTk = " bcc62222fc634ec736589c483de933e6";
	// useEffect(() => {}, []);
	const options = {
		animation: false, //动画小部件
		baseLayerPicker: true, //底图组件，选择三维数字地球的地图
		shouldAnimate: true,
		fullscreenButton: true, //全屏组件
		vrButton: true, //VR模式
		geocoder: true, //地理编码（搜索）组件
		homeButton: true, //home键，点击后跳转到默认视角
		infoBox: false, //信息框
		sceneModePicker: true, //场景模式，切换2D和3D
		selectionIndicator: true, //是否显示指示器组件
		CreditsDisplay: false, //展示数据版权属性。
		timeline: false, //时间轴组件
		useDefaultRenderLoop: true, // 控制是否继续渲染
		// targetFrameRate: 30, // 控制渲染帧数
		maximumScreenSpaceError: 64, //屏幕空间最大误差
		showRenderLoopErrors: false, // 报错是否弹出错误
		useBrowserRecommendedResolution: false, // 设置为false使用window.devicePixelRatio属性
		shadows: false, //是否显示光照投射的阴影terrainShadows:Cesium.ShadowMode.RECEIVE_ONLY,地质接收阴影
		terrainShadows: Cesium.ShadowMode.DISABLED, // 是否打开地形阴影
		navigationHelpButton: false, //帮助提示，如何操作数字地球
		navigationInstructionsInitiallyVisible: true, //如果导航说明最初应该可见，则为 true，如果在用户明确单击按钮之前不应显示导航说明，则为 false。
		resolutionScale: 1, //清晰度 0-1
		// mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL, // 设置2D地图水平旋转
		projectionPicker: true // 设置为true,  ProjectionPicker部件会被创建,    ProjectionPicker：设置地球最佳视角
		// // 如果为真，渲染帧只会在需要时发生，这是由场景中的变化决定的。启用可以减少你的应用程序的CPU/GPU使用，并且在移动设备上使用更少的电池，但是需要使用Scene#requestRender在这种模式下显式地渲染一个新帧。在许多情况下，在API的其他部分更改场景后，这是必要的。请参阅使用显式呈现提高性能。
		// // 不是特别明白，应该是提高渲染性能的
	};

	useEffect(() => {
		let viewer = new Cesium.Viewer("map", options);
		const tdtUrl = "https://t{s}.tianditu.gov.cn/";
		// 服务负载子域
		const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
		const camera = viewer.camera;
		const scene = viewer.scene;
		const imageryLayers = viewer.imageryLayers;
		// imageryLayers.addImageryProvider(
		// 	new Cesium.UrlTemplateImageryProvider({
		// 		url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
		// 		credit: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
		// 	})
		// );
		// const terrainProvider = new Cesium.CesiumTerrainProvider({
		// 	url: "https://assets.agi.com/stk-terrain/world",
		// 	requestWaterMask: true,
		// 	requestVertexNormals: true
		// });
		// view.terrainProvider = terrainProvider;
		let providerViewModels = [];
		//天地图
		// 叠加影像服务
		const tianDiImgMap = new Cesium.UrlTemplateImageryProvider({
			url: tdtUrl + "DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + tk,
			subdomains: subdomains,
			tilingScheme: new Cesium.WebMercatorTilingScheme(),
			maximumLevel: 18
		});
		const tianDiImgMapModelying = new Cesium.ProviderViewModel({
			name: "天地图影像",
			iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxSatellite.png"),
			tooltip: "天地图影像 地图服务",
			creationFunction: function () {
				return tianDiImgMap;
			}
		});
		providerViewModels.push(tianDiImgMapModelying);
		// 叠加国界服务
		const tianDiMap = new Cesium.UrlTemplateImageryProvider({
			url: tdtUrl + "DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=" + tk,
			subdomains: subdomains,
			tilingScheme: new Cesium.WebMercatorTilingScheme(),
			maximumLevel: 10
		});
		//高德
		let gaodev = new Cesium.UrlTemplateImageryProvider({
			url: "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
			subdomains: ["1", "2", "3", "4"]
		});
		const gaodeMapModelying = new Cesium.ProviderViewModel({
			name: "高德矢量",
			iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/openStreetMap.png"),
			tooltip: "高德矢量 地图服务",
			creationFunction: function () {
				return gaodev;
			}
		});
		providerViewModels.push(gaodeMapModelying);
		const gaode = new Cesium.UrlTemplateImageryProvider({
			url: "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
			subdomains: ["1", "2", "3", "4"]
		});
		let gaodeLabel = new Cesium.UrlTemplateImageryProvider({
			url: "http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
			subdomains: ["1", "2", "3", "4"]
		});
		let gaodeMapModel = new Cesium.ProviderViewModel({
			name: "高德影像",
			iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxSatellite.png"),
			tooltip: "高德影像 地图服务",
			creationFunction: function () {
				return [gaode, gaodeLabel];
			}
		});
		providerViewModels.push(gaodeMapModel);

		let tencent = new Cesium.UrlTemplateImageryProvider({
			url: "https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229",
			customTags: {
				sx: function (imageryProvider, x, y, level) {
					return x >> 4;
				},
				sy: function (imageryProvider, x, y, level) {
					return ((1 << level) - y) >> 4;
				}
			}
		});
		let tencentLabel = new Cesium.UrlTemplateImageryProvider({
			url: "https://rt3.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=297"
		});
		const tencentMapModel = new Cesium.ProviderViewModel({
			name: "腾讯影像",
			iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxSatellite.png"),
			tooltip: "腾讯影像 地图服务",
			creationFunction: function () {
				return [tencent, tencentLabel];
			}
		});
		providerViewModels.push(tencentMapModel);
		const googleMap = new Cesium.UrlTemplateImageryProvider({
			url: "http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}",
			tilingScheme: new Cesium.WebMercatorTilingScheme(),
			minimumLevel: 1,
			maximumLevel: 20
		});
		const googleMapModel = new Cesium.ProviderViewModel({
			name: "谷歌影像",
			iconUrl: Cesium.buildModuleUrl("Widgets/Images/ImageryProviders/mapboxSatellite.png"),
			tooltip: "谷歌影像 地图服务",
			creationFunction: function () {
				return googleMap;
			}
		});
		providerViewModels.push(googleMapModel);
		viewer.baseLayerPicker.viewModel.imageryProviderViewModels = providerViewModels;
		viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
		const terrain = Cesium.createWorldTerrain({
			requestWaterMask: true,
			requestVertexNormals: true
		});
		viewer.terrainProvider = terrain; //加入世界地形图

		// 打开深度检测，那么在地形以下的对象不可见
		viewer.scene.globe.depthTestAgainstTerrain = true;

		// 开启全球光照
		viewer.scene.globe.enableLighting = false;
		// 创建相机初始位置和朝向
		const initialPosition = Cesium.Cartesian3.fromDegrees(105.73386, 35.52207, 1000);
		const initialOrientation = Cesium.HeadingPitchRoll.fromDegrees(
			7.1077496389876024807,
			-31.987223091598949054,
			0.025883251314954971306
		);
		let homeCameraView = {
			duration: 2,
			maximumHeight: 2000,
			pitchAdjustHeight: 2000,
			endTransform: Cesium.Matrix4.IDENTITY,
			destination: initialPosition,
			orientation: {
				heading: initialOrientation.heading,
				pitch: initialOrientation.pitch,
				roll: initialOrientation.roll
			}
		};
		// camera.setView(homeCameraView);
		// 增加相机飞行动画参数
		// homeCameraView.duration = 2.0;
		// homeCameraView.maximumHeight = 2000;
		// homeCameraView.pitchAdjustHeight = 2000;
		// homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
		// // Override the default home button
		viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
			e.cancel = true;
			viewer.scene.camera.flyTo(homeCameraView);
		});
		//设置默认地图源
		viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
		scene.globe.enableLighting = true;
		scene.skyBox.show = false;
	}, []);

	return <div id="map" style={{ width: "100%", height: "100%", overflow: "hidden" }}></div>;
};

export default Map;
