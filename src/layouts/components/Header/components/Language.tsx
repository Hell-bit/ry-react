import { Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import type { MenuProps } from "antd";
import { setLanguage } from "@/redux/modules/global/action";

const Language = (props: any) => {
	const { language, setLanguage } = props;

	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: <span>简体中文</span>,
					onClick: () => setLanguage("zh"),
					disabled: language === "zh"
				},
				{
					key: "2",
					label: <span>English</span>,
					onClick: () => setLanguage("en"),
					disabled: language === "en"
				}
			]}
		/>
	);
	const items: MenuProps["items"] = [
		{
			key: "1",
			label: <span>简体中文</span>,
			onClick: () => setLanguage("zh"),
			disabled: language === "zh"
		},
		{
			key: "2",
			label: <span>English</span>,
			onClick: () => setLanguage("en"),
			disabled: language === "en"
		}
	];
	const menuProps = {
		items
	};
	return (
		<Dropdown menu={menuProps} placement="bottom" trigger={["click"]} arrow={true}>
			<a onClick={e => e.preventDefault()}>
				<i className="icon-style iconfont icon-zhongyingwen"></i>
			</a>
		</Dropdown>
	);
};

const mapStateToProps = (state: any) => state.global;
const mapDispatchToProps = { setLanguage };
export default connect(mapStateToProps, mapDispatchToProps)(Language);
