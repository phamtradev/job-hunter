import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Badge, Col, ConfigProvider, Divider, Form, Modal, Row, Space, Typography, Upload, message, notification, theme } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateCompany, callUpdateCompany, callUploadSingleFile } from "@/config/api";
import { ICompany } from "@/types/backend";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import './modal.company.scss';

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

interface ICompanyLogo {
    name: string;
    uid: string;
    url?: string;
}

const ModalCompany = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const { token } = theme.useToken();
    const isEdit = !!dataInit?.id;

    //modal animation
    const [animation, setAnimation] = useState<string>('open');

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataLogo, setDataLogo] = useState<ICompanyLogo[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [value, setValue] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id && dataInit?.description) {
            setValue(dataInit.description);
            form.setFieldsValue({
                name: dataInit.name,
                address: dataInit.address,
            })
            setDataLogo([{
                name: dataInit.logo,
                url: dataInit.logo,
                uid: uuidv4(),
            }])
        }
    }, [dataInit])

    const submitCompany = async (valuesForm: ICompanyForm) => {
        const { name, address } = valuesForm;

        if (dataLogo.length === 0) {
            message.error('Vui lòng upload ảnh Logo')
            return;
        }

        if (dataInit?.id) {
            //update
            const res = await callUpdateCompany(dataInit.id, name, address, value, dataLogo[0].name);
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
            const res = await callCreateCompany(name, address, value, dataLogo[0].name);
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

    const handleRemoveFile = (file: any) => {
        setDataLogo([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "company");

        if (res && res.data) {
            setDataLogo([
                {
                    name: res.data.fileUrl,
                    url: res.data.fileUrl,
                    uid: uuidv4()
                }
            ]);

            if (onSuccess) onSuccess('ok');
        } else {
            onError?.({ event: new Error(res?.message) });
        }
    };


    return (
        <>
            {openModal &&
                <>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#2563eb',
                                borderRadius: 14,
                                fontSize: 14,
                                fontFamily: "'Inter', 'SF Pro Display', 'Segoe UI', sans-serif",
                            }
                        }}
                    >
                        <ModalForm
                            title={
                                <div className="modal-company__title">
                                    <Space size={12} align="start">
                                        <Badge status={isEdit ? "processing" : "success"} />
                                        <div>
                                            <Typography.Title level={4} style={{ margin: 0, color: token.colorTextHeading }}>
                                                {isEdit ? "Cập nhật Company" : "Tạo mới Company"}
                                            </Typography.Title>
                                            <Typography.Text type="secondary">
                                                Thông tin hiển thị trên hồ sơ tuyển dụng của bạn
                                            </Typography.Text>
                                        </div>
                                    </Space>
                                </div>
                            }
                            open={openModal}
                            modalProps={{
                                onCancel: () => { handleReset() },
                                afterClose: () => handleReset(),
                                destroyOnClose: true,
                                width: isMobile ? "100%" : 960,
                                footer: null,
                                keyboard: false,
                                maskClosable: false,
                                styles: {
                                    body: { padding: isMobile ? 14 : 24, background: token.colorBgLayout }
                                },
                                className: `modal-company ${animation}`,
                                rootClassName: `modal-company-root ${animation}`
                            }}
                            scrollToFirstError={true}
                            preserve={false}
                            form={form}
                            onFinish={submitCompany}
                            initialValues={dataInit?.id ? dataInit : {}}
                            submitter={{
                                render: (_: any, dom: any) => <FooterToolbar className="modal-company__footer">{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />,
                                    className: "modal-company__primary-btn"
                                },
                                resetButtonProps: {
                                    className: "modal-company__ghost-btn"
                                },
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                                }
                            }}
                        >
                            <ProCard
                                ghost
                                bordered
                                className="modal-company__card"
                                headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
                                bodyStyle={{ paddingTop: 8 }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={16}>
                                        <ProCard
                                            bordered
                                            className="modal-company__section"
                                            title={<Typography.Text strong>Thông tin công ty</Typography.Text>}
                                            headerBordered
                                        >
                                            <Space direction="vertical" size={14} style={{ width: '100%' }}>
                                                <ProFormText
                                                    label="Tên công ty"
                                                    name="name"
                                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                                    placeholder="Nhập tên công ty"
                                                    fieldProps={{
                                                        size: "large",
                                                        allowClear: true
                                                    }}
                                                />
                                                <ProFormTextArea
                                                    label="Địa chỉ"
                                                    name="address"
                                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                                    placeholder="Nhập địa chỉ công ty"
                                                    fieldProps={{
                                                        autoSize: { minRows: 3, maxRows: 6 },
                                                        showCount: true
                                                    }}
                                                />
                                            </Space>
                                        </ProCard>
                                        <ProCard
                                            bordered
                                            className="modal-company__section"
                                            title={<Typography.Text strong>Giới thiệu & miêu tả</Typography.Text>}
                                            headStyle={{ marginTop: 8 }}
                                            headerBordered
                                        >
                                            <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
                                                Giúp ứng viên hiểu về văn hóa, sứ mệnh và môi trường làm việc.
                                            </Typography.Paragraph>
                                            <div className="modal-company__editor">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={value}
                                                    onChange={setValue}
                                                />
                                            </div>
                                        </ProCard>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <ProCard
                                            bordered
                                            className="modal-company__section modal-company__upload"
                                            title={<Typography.Text strong>Ảnh Logo</Typography.Text>}
                                            extra={<Typography.Text type="secondary">PNG hoặc JPG &lt; 2MB</Typography.Text>}
                                            headerBordered
                                        >
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                name="logo"
                                                rules={[{
                                                    required: true,
                                                    message: 'Vui lòng không bỏ trống',
                                                    validator: () => {
                                                        if (dataLogo.length > 0) return Promise.resolve();
                                                        else return Promise.reject(false);
                                                    }
                                                }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <ConfigProvider locale={enUS}>
                                                    <Upload
                                                        name="logo"
                                                        listType="picture-card"
                                                        className="modal-company__uploader"
                                                        maxCount={1}
                                                        multiple={false}
                                                        customRequest={handleUploadFileLogo}
                                                        beforeUpload={beforeUpload}
                                                        onChange={handleChange}
                                                        onRemove={(file) => handleRemoveFile(file)}
                                                        onPreview={handlePreview}
                                                        defaultFileList={
                                                            dataInit?.id ? [
                                                                {
                                                                    uid: uuidv4(),
                                                                    name: dataInit.logo,
                                                                    url: dataInit.logo,
                                                                    status: 'done'
                                                                }
                                                            ] : []
                                                        }
                                                    >
                                                        <div className="modal-company__upload-inner">
                                                            <div className="modal-company__upload-icon">
                                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                            </div>
                                                            <Typography.Text strong>
                                                                Tải logo lên
                                                            </Typography.Text>
                                                            <Typography.Text type="secondary" className="modal-company__upload-hint">
                                                                Kéo thả hoặc nhấn để chọn file
                                                            </Typography.Text>
                                                        </div>
                                                    </Upload>
                                                </ConfigProvider>
                                            </Form.Item>
                                            <Divider />
                                            <Space direction="vertical" size={8}>
                                                <Typography.Text type="secondary">Gợi ý:</Typography.Text>
                                                <Typography.Text>- Sử dụng logo nền trong suốt.</Typography.Text>
                                                <Typography.Text>- Tỷ lệ vuông để hiển thị đẹp hơn.</Typography.Text>
                                            </Space>
                                        </ProCard>
                                    </Col>
                                </Row>
                            </ProCard>
                        </ModalForm>
                    </ConfigProvider>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ zIndex: 1500 }}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </>
            }
        </>
    )
}

export default ModalCompany;
