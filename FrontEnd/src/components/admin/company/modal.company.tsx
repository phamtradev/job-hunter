import { CheckSquareOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateCompany, callUpdateCompany } from "@/config/api";
import { ICompany } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICompany | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface ICompanyForm {
    name: string;
    address: string;
}

const ModalCompany = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    //modal animation
    const [animation, setAnimation] = useState<string>('open');

    const [value, setValue] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id && dataInit?.description) {
            setValue(dataInit.description);
            form.setFieldsValue({
                name: dataInit.name,
                address: dataInit.address,
            })

        }
    }, [dataInit])

    const submitCompany = async (valuesForm: ICompanyForm) => {
        const { name, address } = valuesForm;

        if (dataInit?.id) {
            //update
            const res = await callUpdateCompany(dataInit.id, name, address, value);
            if (res.data) {
                message.success("Cập nhật company thành công");
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
            const res = await callCreateCompany(name, address, value);
            if (res.data) {
                message.success("Thêm mới company thành công");
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
        setValue("");
        setDataInit(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))
        setOpenModal(false);
        setAnimation('open')
    }

    return (
        <>
            {openModal &&
                <ModalForm
                    title={<>{dataInit?.id ? "Cập nhật Company" : "Tạo mới Company"}</>}
                    open={openModal}
                    modalProps={{
                        onCancel: () => { handleReset() },
                        afterClose: () => handleReset(),
                        destroyOnClose: true,
                        width: isMobile ? "100%" : 900,
                        footer: null,
                        keyboard: false,
                        maskClosable: false,
                        className: `modal-company ${animation}`,
                        rootClassName: `modal-company-root ${animation}`
                    }}
                    scrollToFirstError={true}
                    preserve={false}
                    form={form}
                    onFinish={submitCompany}
                    initialValues={dataInit?.id ? dataInit : {}}
                    submitter={{
                        render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
                        submitButtonProps: {
                            icon: <CheckSquareOutlined />
                        },
                        searchConfig: {
                            resetText: "Hủy",
                            submitText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                        }
                    }}
                >
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="Tên công ty"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập tên công ty"
                            />
                        </Col>

                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormTextArea
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                placeholder="Nhập địa chỉ công ty"
                            />
                        </Col>

                        <ProCard
                            title="Miêu tả"
                            // subTitle="mô tả công ty"
                            headStyle={{ color: '#d81921' }}
                            style={{ marginBottom: 20 }}
                            headerBordered
                            size="small"
                            bordered
                        >
                            <Col span={24}>
                                <ReactQuill
                                    theme="snow"
                                    value={value}
                                    onChange={setValue}
                                />
                            </Col>
                        </ProCard>
                    </Row>
                </ModalForm>
            }
        </>
    )
}

export default ModalCompany;
