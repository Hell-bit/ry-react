import React, { useState, useRef, useEffect } from "react";
import type { FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getOperlogList, removeOperlog, addOperlog, updateOperlog, exportOperlog } from "@/api/monitor/operlog";
import UpdateForm from "./detail";
import access from "@/access";
import { getDictValueEnum } from "@/api/system/dict";
import DictTag from "@/components/DictTag";

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.Monitor.Operlog) => {
	const hide = message.loading("正在添加");
	try {
		const resp = await addOperlog({ ...fields });
		hide();
		if (resp.code === 200) {
			message.success("添加成功");
		} else {
			message.error(resp.msg);
		}
		return true;
	} catch (error) {
		hide();
		message.error("添加失败请重试！");
		return false;
	}
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.Monitor.Operlog) => {
	const hide = message.loading("正在更新");
	try {
		const resp = await updateOperlog(fields);
		hide();
		if (resp.code === 200) {
			message.success("更新成功");
		} else {
			message.error(resp.msg);
		}
		return true;
	} catch (error) {
		hide();
		message.error("配置失败请重试！");
		return false;
	}
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.Monitor.Operlog[]) => {
	const hide = message.loading("正在删除");
	if (!selectedRows) return true;
	try {
		const resp = await removeOperlog(selectedRows.map(row => row.operId).join(","));
		hide();
		if (resp.code === 200) {
			message.success("删除成功，即将刷新");
		} else {
			message.error(resp.msg);
		}
		return true;
	} catch (error) {
		hide();
		message.error("删除失败，请重试");
		return false;
	}
};

/**
 * 导出数据
 *
 *
 */
const handleExport = async () => {
	const hide = message.loading("正在导出");
	try {
		await exportOperlog();
		hide();
		message.success("导出成功");
		return true;
	} catch (error) {
		hide();
		message.error("导出失败，请重试");
		return false;
	}
};

const OperlogTableList: React.FC = () => {
	const formTableRef = useRef<FormInstance>();

	const [modalVisible, setModalVisible] = useState<boolean>(false);

	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.Monitor.Operlog>();
	const [selectedRows, setSelectedRows] = useState<API.Monitor.Operlog[]>([]);

	const [businessTypeOptions, setBusinessTypeOptions] = useState<any>([]);
	const [operatorTypeOptions, setOperatorTypeOptions] = useState<any>([]);
	const [statusOptions, setStatusOptions] = useState<any>([]);

	useEffect(() => {
		getDictValueEnum("sys_oper_type", true).then(data => {
			setBusinessTypeOptions(data);
		});
		getDictValueEnum("sys_oper_type", true).then(data => {
			setOperatorTypeOptions(data);
		});
		getDictValueEnum("sys_common_status", true).then(data => {
			setStatusOptions(data);
		});
	}, []);

	const columns: ProColumns<API.Monitor.Operlog>[] = [
		{
			title: "日志主键",
			dataIndex: "operId",
			valueType: "text",
			hideInSearch: true
		},
		{
			title: "操作模块",
			dataIndex: "title",
			valueType: "text"
		},
		{
			title: "业务类型",
			dataIndex: "businessType",
			valueType: "select",
			valueEnum: businessTypeOptions,
			render: (_, record) => {
				return <DictTag enums={businessTypeOptions} value={record.businessType} />;
			}
		},
		{
			title: "请求方式",
			dataIndex: "requestMethod",
			valueType: "text"
		},
		{
			title: "操作类别",
			dataIndex: "operatorType",
			valueType: "select",
			valueEnum: operatorTypeOptions,
			render: (_, record) => {
				return <DictTag enums={operatorTypeOptions} value={record.operatorType} />;
			}
		},
		{
			title: "操作人员",
			dataIndex: "operName",
			valueType: "text"
		},
		{
			title: "主机地址",
			dataIndex: "operIp",
			valueType: "text"
		},
		{
			title: "操作地点",
			dataIndex: "operLocation",
			valueType: "text"
		},
		{
			title: "操作状态",
			dataIndex: "status",
			valueType: "select",
			valueEnum: statusOptions,
			render: (_, record) => {
				return <DictTag key="status" enums={statusOptions} value={record.status} />;
			}
		},
		{
			title: "操作时间",
			dataIndex: "operTime",
			valueType: "dateTime"
		},
		{
			title: "操作",
			dataIndex: "option",
			width: "120px",
			valueType: "option",
			render: (_, record) => [
				<Button
					type="link"
					size="small"
					key="edit"
					hidden={!access({}).hasPerms("system:operlog:edit")}
					onClick={() => {
						setModalVisible(true);
						setCurrentRow(record);
					}}
				>
					详细
				</Button>
			]
		}
	];

	return (
		<PageContainer>
			<div style={{ width: "100%", float: "right" }}>
				<ProTable<API.Monitor.Operlog>
					headerTitle="信息"
					actionRef={actionRef}
					formRef={formTableRef}
					rowKey="operId"
					key="operlogList"
					search={{
						labelWidth: 120
					}}
					toolBarRender={() => [
						<Button
							type="primary"
							key="add"
							hidden={!access({}).hasPerms("system:operlog:add")}
							onClick={async () => {
								setCurrentRow(undefined);
								setModalVisible(true);
							}}
						>
							<PlusOutlined /> 新建
						</Button>,
						<Button
							type="primary"
							key="remove"
							hidden={selectedRows?.length === 0 || !access({}).hasPerms("system:operlog:remove")}
							onClick={async () => {
								Modal.confirm({
									title: "是否确认删除所选数据项?",
									icon: <ExclamationCircleOutlined />,
									content: "请谨慎操作",
									async onOk() {
										const success = await handleRemove(selectedRows);
										if (success) {
											setSelectedRows([]);
											actionRef.current?.reloadAndRest?.();
										}
									},
									onCancel() {}
								});
							}}
						>
							<DeleteOutlined />
							删除
						</Button>,
						<Button
							type="primary"
							key="export"
							hidden={!access({}).hasPerms("system:operlog:export")}
							onClick={async () => {
								handleExport();
							}}
						>
							<PlusOutlined />
							导出
						</Button>
					]}
					request={params =>
						getOperlogList({ ...params } as API.Monitor.OperlogListParams).then(res => {
							const result = {
								data: res.rows,
								total: res.total,
								success: true
							};
							return result;
						})
					}
					columns={columns}
					rowSelection={{
						onChange: (_, selectedRows) => {
							setSelectedRows(selectedRows);
						}
					}}
				/>
			</div>
			{selectedRows?.length > 0 && (
				<FooterToolbar
					extra={
						<div>
							已选择
							<a style={{ fontWeight: 600 }}>{selectedRows.length}</a>项
						</div>
					}
				>
					<Button
						key="remove"
						// hidden={!access.hasPerms('system:operlog:del')}
						onClick={async () => {
							Modal.confirm({
								title: "删除",
								content: "确定删除该项吗？",
								okText: "确认",
								cancelText: "取消",
								onOk: async () => {
									const success = await handleRemove(selectedRows);
									if (success) {
										setSelectedRows([]);
										actionRef.current?.reloadAndRest?.();
									}
								}
							});
						}}
					>
						批量删除
					</Button>
				</FooterToolbar>
			)}
			<UpdateForm
				onSubmit={async values => {
					let success = false;
					if (values.operId) {
						success = await handleUpdate({ ...values } as API.Monitor.Operlog);
					} else {
						success = await handleAdd({ ...values } as API.Monitor.Operlog);
					}
					if (success) {
						setModalVisible(false);
						setCurrentRow(undefined);
						if (actionRef.current) {
							actionRef.current.reload();
						}
					}
				}}
				onCancel={() => {
					setModalVisible(false);
					setCurrentRow(undefined);
				}}
				open={modalVisible}
				values={currentRow || {}}
				businessTypeOptions={businessTypeOptions}
				operatorTypeOptions={operatorTypeOptions}
				statusOptions={statusOptions}
			/>
		</PageContainer>
	);
};

export default OperlogTableList;
