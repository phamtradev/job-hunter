import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateSkill, callUpdateSkill } from "@/config/api";
import { ISkill } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISkill | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}



const ModalSkill = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();


    const submitSkill = async (valuesForm: any) => {
        const { name } = valuesForm;
        if (dataInit?.id) {
            //update
            const res = await callUpdateSkill(dataInit.id, name);
            if (res.data) {
                message.success("Cập nhật skill thành công");
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
            const res = await callCreateSkill(name);
            if (res.data) {
                message.success("Thêm mới skill thành công");
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
                title={<>{dataInit?.id ? "Cập nhật Skill" : "Tạo mới Skill"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 600,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitSkill}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <ProFormText
                            label="Tên skill"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên skill"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalSkill;
