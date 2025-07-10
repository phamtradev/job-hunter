import { FooterToolbar, ModalForm, ProCard, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateRole, callFetchPermission, callUpdateRole } from "@/config/api";
import { IPermission } from "@/types/backend";
import { CheckSquareOutlined } from "@ant-design/icons";
import ModuleApi from "./module.api";
import { useState, useEffect } from 'react';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetSingleRole } from "@/redux/slice/roleSlide";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
}



const ModalRole = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable } = props;
    const singleRole = useAppSelector(state => state.role.singleRole);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();

    //all backend permissions
    const [listPermissions, setListPermissions] = useState<{
        module: string;
        permissions: IPermission[]
    }[] | null>(null);

    const groupByPermission = (data: any[]): { module: string; permissions: IPermission[] }[] => {
        const groupedData = groupBy(data, x => x.module);
        return map(groupedData, (value, key) => {
            return { module: key, permissions: value as IPermission[] };
        });
    };

    useEffect(() => {
        const init = async () => {
            const res = await callFetchPermission(`page=1&size=100`);
            if (res.data?.result) {
                setListPermissions(groupByPermission(res.data?.result))
            }
        }
        init();
    }, [])

    useEffect(() => {
        if (listPermissions?.length && singleRole?.id) {
            form.setFieldsValue({
                name: singleRole.name,
                active: singleRole.active,
                description: singleRole.description
            })
            //current permissions of role
            const userPermissions = groupByPermission(singleRole.permissions);

            listPermissions.forEach(x => {
                let allCheck = true;
                x.permissions?.forEach(y => {
                    const temp = userPermissions.find(z => z.module === x.module);

                    if (temp) {
                        const isExist = temp.permissions.find(k => k.id === y.id);
                        if (isExist) {
                            form.setFieldValue(["permissions", y.id as string], true);
                        } else allCheck = false;
                    } else {
                        allCheck = false;
                    }
                })
                form.setFieldValue(["permissions", x.module], allCheck)
            })
        }
    }, [listPermissions, singleRole])

    const submitRole = async (valuesForm: any) => {
        const { description, active, name, permissions } = valuesForm;
        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (key.match(/^[1-9][0-9]*$/) && permissions[key] === true) {
                    checkedPermissions.push({ id: key });
                }
            }
        }

        if (singleRole?.id) {
            //update
            const role = {
                name, description, active, permissions: checkedPermissions
            }
            const res = await callUpdateRole(role, singleRole.id);
            if (res.data) {
                message.success("Cập nhật role thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const role = {
                name, description, active, permissions: checkedPermissions
            }
            const res = await callCreateRole(role);
            if (res.data) {
                message.success("Thêm mới role thành công");
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
        setOpenModal(false);
        dispatch(resetSingleRole({}));
    }

    return (
        <>
            <ModalForm
                title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,

                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitRole}
                submitter={{
                    render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />
                    },
                    searchConfig: {
                        resetText: "Hủy",
                        submitText: <>{singleRole?.id ? "Cập nhật" : "Tạo mới"}</>,
                    }
                }}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Role"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSwitch
                            label="Trạng thái"
                            name="active"
                            checkedChildren="ACTIVE"
                            unCheckedChildren="INACTIVE"
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>

                    <Col span={24}>
                        <ProFormTextArea
                            label="Miêu tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập miêu tả role"
                            fieldProps={{
                                autoSize: { minRows: 2 }
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <ProCard
                            title="Quyền hạn"
                            subTitle="Các quyền hạn được phép cho vai trò này"
                            headStyle={{ color: '#d81921' }}
                            style={{ marginBottom: 20 }}
                            headerBordered
                            size="small"
                            bordered
                        >
                            <ModuleApi
                                form={form}
                                listPermissions={listPermissions}
                            />

                        </ProCard>

                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalRole;
