import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { HOME_URL } from "@/config/config";

const MoreButton = (props: any) => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	// close multipleTab
	const closeMultipleTab = (tabPath?: string) => {
		const handleTabsList = props.tabsList.filter((item: Menu.MenuOptions) => {
			return item.path === tabPath || item.path === HOME_URL;
		});
		props.setTabsList(handleTabsList);
		tabPath ?? navigate(HOME_URL);
	};
	//标签处理
	const items: MenuProps["items"] = [
		{
			key: "1",
			label: <span>{t("tabs.closeCurrent")}</span>,
			onClick: () => props.delTabs(pathname)
		},
		{
			key: "2",
			label: <span>{t("tabs.closeOther")}</span>,
			onClick: () => closeMultipleTab(pathname)
		},
		{
			key: "3",
			label: <span>{t("tabs.closeAll")}</span>,
			onClick: () => closeMultipleTab()
		}
	];
	const menuProps = {
		items
	};
	return (
		<Dropdown menu={menuProps} placement="bottom" trigger={["click"]} arrow={true}>
			<Button className="more-button" type="primary" size="small">
				<a onClick={e => e.preventDefault()}>
					{t("tabs.more")} <DownOutlined />
				</a>
			</Button>
		</Dropdown>
	);
};
export default MoreButton;
