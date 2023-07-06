import React, { useState, useRef, useEffect } from "react";
import type { FormInstance } from "antd";
import { useParams } from "react-router-dom";
import { Button, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getJobLogList, removeJobLog, exportJobLog } from "@/api/monitor/jobLog";
import access from "@/access";
import DetailForm from "./detail";
import { getDictValueEnum } from "@/api/system/dict";
import { getJob } from "@/api/monitor/job";
import DictTag from "@/components/DictTag";

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.Monitor.JobLog[]) => {
	const hide = message.loading("正在删除");
	if (!selectedRows) return true;
	try {
		const resp = await removeJobLog(selectedRows.map(row => row.jobLogId).join(","));
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

const handleRemoveOne = async (selectedRow: API.Monitor.JobLog) => {
	const hide = message.loading("正在删除");
	if (!selectedRow) return true;
	try {
		const params = [selectedRow.jobLogId];
		const resp = await removeJobLog(params.join(","));
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
 * 清空日志数据
 *
 */
const handleExport = async () => {
	const hide = message.loading("正在导出");
	try {
		await exportJobLog();
		hide();
		message.success("导出成功");
		return true;
	} catch (error) {
		hide();
		message.error("导出失败，请重试");
		return false;
	}
};

const JobLogTableList: React.FC = () => {
	const navigate = useNavigate();
	const formTableRef = useRef<FormInstance>();

	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.Monitor.JobLog>();
	const [selectedRows, setSelectedRows] = useState<API.Monitor.JobLog[]>([]);

	const [jobGroupOptions, setJobGroupOptions] = useState<any>([]);
	const [statusOptions, setStatusOptions] = useState<any>([]);

	const [queryParams, setQueryParams] = useState<any>([]);

	const params = useParams();
	if (params.id === undefined) {
		navigate("/monitor/job");
	}
	const jobId = params.id || 0;
	useEffect(() => {
		if (jobId !== undefined && jobId !== 0) {
			getJob(Number(jobId)).then(response => {
				setQueryParams({
					jobName: response.data.jobName,
					jobGroup: response.data.jobGroup
				});
			});
		}
		getDictValueEnum("sys_job_status").then(data => {
			setStatusOptions(data);
		});
		getDictValueEnum("sys_job_group").then(data => {
			setJobGroupOptions(data);
		});
	}, []);

	const columns: ProColumns<API.Monitor.JobLog>[] = [
		{
			title: "任务日志编号",
			dataIndex: "jobLogId",
			valueType: "text",
			hideInSearch: true
		},
		{
			title: "任务名称",
			dataIndex: "jobName",
			valueType: "text"
		},
		{
			title: "任务组名",
			dataIndex: "jobGroup",
			valueType: "text"
		},
		{
			title: "调用目标字符串",
			dataIndex: "invokeTarget",
			valueType: "textarea"
		},
		{
			title: "日志信息",
			dataIndex: "jobMessage",
			valueType: "textarea"
		},
		{
			title: "执行状态",
			dataIndex: "status",
			valueType: "select",
			valueEnum: statusOptions,
			render: (_, record) => {
				return <DictTag enums={statusOptions} value={record.status} />;
			}
		},
		{
			title: "异常信息",
			dataIndex: "createTime",
			valueType: "text"
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
					hidden={!access({}).hasPerms("monitor:job-log:edit")}
					onClick={() => {
						setModalOpen(true);
						setCurrentRow(record);
					}}
				>
					编辑
				</Button>,
				<Button
					type="link"
					size="small"
					danger
					key="batchRemove"
					hidden={!access({}).hasPerms("monitor:job-log:remove")}
					onClick={async () => {
						Modal.confirm({
							title: "删除",
							content: "确定删除该项吗？",
							okText: "确认",
							cancelText: "取消",
							onOk: async () => {
								const success = await handleRemoveOne(record);
								if (success) {
									if (actionRef.current) {
										actionRef.current.reload();
									}
								}
							}
						});
					}}
				>
					删除
				</Button>
			]
		}
	];

	return (
		<PageContainer>
			<div style={{ width: "100%", float: "right" }}>
				<ProTable<API.Monitor.JobLog>
					headerTitle="信息"
					actionRef={actionRef}
					formRef={formTableRef}
					rowKey="jobLogId"
					key="job-logList"
					search={{
						labelWidth: 120
					}}
					toolBarRender={() => [
						<Button
							type="primary"
							key="add"
							hidden={!access({}).hasPerms("monitor:job-log:add")}
							onClick={async () => {
								setCurrentRow(undefined);
								setModalOpen(true);
							}}
						>
							<PlusOutlined /> 新建
						</Button>,
						<Button
							type="primary"
							key="remove"
							hidden={selectedRows?.length === 0 || !access({}).hasPerms("monitor:job-log:remove")}
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
							hidden={!access({}).hasPerms("monitor:job-log:export")}
							onClick={async () => {
								handleExport();
							}}
						>
							<PlusOutlined />
							导出
						</Button>
					]}
					params={queryParams}
					request={params =>
						getJobLogList({ ...params } as API.Monitor.JobLogListParams).then(res => {
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
						hidden={!access({}).hasPerms("monitor:job-log:del")}
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
			<DetailForm
				onCancel={() => {
					setModalOpen(false);
					setCurrentRow(undefined);
				}}
				open={modalOpen}
				values={currentRow || {}}
				statusOptions={statusOptions}
				jobGroupOptions={jobGroupOptions}
			/>
		</PageContainer>
	);
};

export default JobLogTableList;
