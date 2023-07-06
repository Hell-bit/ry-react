//map
declare namespace MapCesium {
	type MapOptions = {
		animation: Boolean; //动画
		homeButton: Boolean; //home键
		geocoder: Boolean; //地址编码
		baseLayerPicker: Boolean; //图层选择控件
		timeline: Boolean; //时间轴
		fullscreenButton: Boolean; //全屏显示
		infoBox: Boolean; //点击要素之后浮窗
		sceneModePicker: Boolean; //投影方式  三维/二维
		navigationInstructionsInitiallyVisible: Boolean; //导航指令
		navigationHelpButton: Boolean; //帮助信息
		selectionIndicator: Boolean; // 选择
	};
}
