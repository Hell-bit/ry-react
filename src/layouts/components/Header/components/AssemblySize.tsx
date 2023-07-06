import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { setAssemblySize } from "@/redux/modules/global/action";
import { connect } from "react-redux";

const AssemblySize = (props: any) => {
	const { assemblySize, setAssemblySize } = props;

	// 切换组件大小
	const items: MenuProps["items"] = [
		{
			key: "middle",
			disabled: assemblySize == "middle",
			label: <span>默认</span>
		},
		{
			disabled: assemblySize == "large",
			key: "large",
			label: <span>大型</span>
		},
		{
			disabled: assemblySize == "small",
			key: "small",
			label: <span>小型</span>
		}
	];
	const handleMenuClick: MenuProps["onClick"] = e => {
		setAssemblySize(e.key);
	};
	const menuProps = {
		items,
		onClick: handleMenuClick
	};
	return (
		<Dropdown menu={menuProps} placement="bottom" trigger={["click"]} arrow={true}>
			<a onClick={e => e.preventDefault()}>
				<i className="icon-style iconfont icon-contentright"></i>
			</a>
		</Dropdown>
	);
};

const mapStateToProps = (state: any) => state.global;
const mapDispatchToProps = { setAssemblySize };
export default connect(mapStateToProps, mapDispatchToProps)(AssemblySize);
