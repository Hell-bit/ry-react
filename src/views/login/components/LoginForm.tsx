import md5 from "js-md5";
import { useState, useEffect } from "react";
import { Button, Form, Input, message, Image, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi, fetchUserInfo } from "@/api/modules/login";
import { HOME_URL } from "@/config/config";
import { connect } from "react-redux";
import { setToken, setCurrentUser, setRemoteRoute } from "@/redux/modules/global/action";
import { useTranslation } from "react-i18next";
import { clearSessionToken, setSessionToken } from "@/access";
import { setTabsList } from "@/redux/modules/tabs/action";
import { getCaptchaImg } from "@/api/modules/login";
import { UserOutlined, LockOutlined, CloseCircleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { getRemoteMenu, getRoutersInfo, getUserInfo, patchRouteWithRemoteMenus, setRemoteMenu } from "@/utils/session";

const LoginForm = (props: any) => {
	const { t } = useTranslation();
	const { setToken, setTabsList, setCurrentUser, setRemoteRoute } = props;
	const [captchaCode, setCaptchaCode] = useState<string>("");
	const [uuid, setUuid] = useState<string>("");
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	const getCaptchaCode = async () => {
		const response = await getCaptchaImg();
		const imgdata = `data:image/png;base64,${response.img}`;
		setCaptchaCode(imgdata);
		setUuid(response.uuid);
	};
	const getUserInfo = async () => {
		const { data } = await fetchUserInfo();
		setCurrentUser(data);
	};
	useEffect(() => {
		getCaptchaCode();
	}, []);
	// 登录
	const onFinish = async (loginForm: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			loginForm.password = md5(loginForm.password);
			const { token } = await loginApi({ ...loginForm, uuid });
			setToken(token);
			const current = new Date();
			const expireTime = current.setTime(current.getTime() + 1000 * 12 * 60 * 60);
			setSessionToken(token, token, expireTime);
			setTabsList([]);
			await getUserInfo();
			message.success("登录成功！");
			navigate(HOME_URL);
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{ span: 5 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			size="large"
			autoComplete="off"
		>
			<Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
				<Input placeholder="用户名：admin / user" prefix={<UserOutlined />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
				<Input.Password autoComplete="new-password" placeholder="密码：123456" prefix={<LockOutlined />} />
			</Form.Item>

			<Form.Item name="code" rules={[{ required: true, message: "请输入验证码!" }]}>
				<Row>
					<Col flex={4}>
						<Input className="captcha-input" placeholder="验证码" prefix={<SafetyCertificateOutlined />} />
					</Col>
					<Col flex={1}>
						<Image
							src={captchaCode}
							alt="验证码"
							style={{
								display: "inline-block",
								height: 40,
								verticalAlign: "top",
								cursor: "pointer",
								paddingLeft: "10px",
								width: "100px"
							}}
							preview={false}
							onClick={() => getCaptchaCode()}
						/>
					</Col>
				</Row>
			</Form.Item>

			<Form.Item className="login-btn">
				<Button
					onClick={() => {
						form.resetFields();
					}}
					icon={<CloseCircleOutlined />}
				>
					{t("login.reset")}
				</Button>
				<Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
					{t("login.confirm")}
				</Button>
			</Form.Item>
		</Form>
	);
};

const mapDispatchToProps = { setToken, setTabsList, setCurrentUser, setRemoteRoute };
export default connect(null, mapDispatchToProps)(LoginForm);
