import { CheckSquareOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateCompany } from "@/config/api";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICompany;
}
const ModalCompany = (props: IProps) => {
    const { openModal, setOpenModal } = props;
    const [value, setValue] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {

    }, [])

    const submitCompany = async (valuesForm: any) => {
        const { name, address } = valuesForm;

        const res = await callCreateCompany(name, address, value);
        if (res.data) {
            message.success("Thêm mới company thành công");
            setOpenModal(false);
            handleReset();
        } else {

        }
    }

    const handleReset = () => {
        form.resetFields();
        setValue("");
    }
    return (
        <>
            <ModalForm
                title={`Tạo mới Company`}
                open={openModal}
                modalProps={{
                    onCancel: () => { setOpenModal(false); handleReset(); },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    footer: null,
                    keyboard: false,
                    maskClosable: false
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitCompany}
                submitter={{
                    render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />
                    },
                    searchConfig: {
                        resetText: "Hủy",
                        submitText: "Tạo mới",
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
                                theme="snow" value={value} onChange={setValue} />
                        </Col>
                    </ProCard>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalCompany;
