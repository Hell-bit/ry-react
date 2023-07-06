import logo from "@/assets/images/logo.png";
import { connect } from "react-redux";

const Logo = (props: any) => {
	const { isCollapse } = props;
	return (
		<div className="logo-box">
			<img src={logo} alt="logo" className="logo-img" />
			{!isCollapse ? <h5 className="logo-text">灌区信息化</h5> : null}
		</div>
	);
};

const mapStateToProps = (state: any) => state.menu;
export default connect(mapStateToProps)(Logo);
