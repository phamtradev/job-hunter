import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Badge, Col, Divider, Form, Row, Space, Typography, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreatePermission, callUpdatePermission } from "@/config/api";
import { IPermission } from "@/types/backend";
import { useEffect } from "react";
import '@/styles/tailwind.css';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IPermission | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}



const ModalPermission = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue(dataInit)
        }
    }, [dataInit])

    const submitPermission = async (valuesForm: any) => {
        const { name, apiPath, method, module } = valuesForm;
        if (dataInit?.id) {
            //update
            const permission = {
                name,
                apiPath, method, module
            }

            const res = await callUpdatePermission(permission, dataInit.id);
            if (res.data) {
                message.success("Cập nhật permission thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error
                });
            }
        } else {
            //create
            const permission = {
                name,
                apiPath, method, module
            }
            const res = await callCreatePermission(permission);
            if (res.data) {
                message.success("Thêm mới permission thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    }

    return (
        <>
            <ModalForm
                title={
                    <div className="flex items-start gap-3">
                        <Badge status={dataInit?.id ? "processing" : "success"} />
                        <div className="flex flex-col">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                {dataInit?.id ? "Cập nhật Permission" : "Tạo mới Permission"}
                            </Typography.Title>
                            <Typography.Text type="secondary">
                                Quản lý quyền truy cập cho các module hệ thống
                            </Typography.Text>
                        </div>
                    </div>
                }
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 860,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy",
                    className: "permission-modal glass-card",
                    bodyStyle: { padding: isMobile ? 16 : 24, background: "#f8fafc" }
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitPermission}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 border border-slate-100">
                    <Space direction="vertical" size={8} className="w-full">
                        <Typography.Text type="secondary">
                            Thiết lập chi tiết cho permission, đảm bảo đặt tên rõ ràng, đúng module và method.
                        </Typography.Text>
                        <Divider className="my-2" />
                    </Space>
                    <Row gutter={[16, 16]}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="Tên Permission"
                                name="name"
                                rules={[
                                    { required: true, message: 'Vui lòng không bỏ trống' },
                                ]}
                                placeholder="Nhập name"
                                fieldProps={{
                                    size: "large",
                                    allowClear: true
                                }}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="API Path"
                                name="apiPath"
                                rules={[
                                    { required: true, message: 'Vui lòng không bỏ trống' },
                                ]}
                                placeholder="Nhập path"
                                fieldProps={{
                                    size: "large",
                                    allowClear: true
                                }}
                            />
                        </Col>

                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormSelect
                                name="method"
                                label="Method"
                                valueEnum={{
                                    GET: 'GET',
                                    POST: 'POST',
                                    PUT: 'PUT',
                                    PATCH: 'PATCH',
                                    DELETE: 'DELETE',
                                }}
                                placeholder="Please select a method"
                                rules={[{ required: true, message: 'Vui lòng chọn method!' }]}
                                fieldProps={{
                                    size: "large"
                                }}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormSelect
                                name="module"
                                label="Thuộc Module"
                                valueEnum={{
                                    COMPANIES: 'COMPANIES',
                                    FILES: 'FILES',
                                    JOBS: 'JOBS',
                                    PERMISSIONS: 'PERMISSIONS',
                                    RESUMES: 'RESUMES',
                                    ROLES: 'ROLES',
                                    USERS: 'USERS',
                                    SUBSCRIBERS: 'SUBSCRIBERS'
                                }}
                                placeholder="Please select a module"
                                rules={[{ required: true, message: 'Vui lòng chọn module!' }]}
                                fieldProps={{
                                    size: "large"
                                }}
                            />
                        </Col>

                    </Row>
                </div>
            </ModalForm>
        </>
    )
}

export default ModalPermission;
