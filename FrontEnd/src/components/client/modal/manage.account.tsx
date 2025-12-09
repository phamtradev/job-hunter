import { Modal, Table, Tabs, Form, Input, Select, Row, Col, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser, callUpdateUserInfo, callChangePassword } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchAccount } from '@/redux/slice/accountSlide';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",

        },
        {
            title: 'Job title',
            dataIndex: ["job", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);
    const dispatch = useAppDispatch();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                address: user.address
            });
        }
    }, [user]);

    const onFinish = async (values: any) => {
        const { id, name, age, gender, address } = values;
        setIsSubmit(true);

        const res = await callUpdateUserInfo(id, name, +age, gender, address);
        if (res && res.data) {
            message.success("Cập nhật thông tin thành công");
            dispatch(fetchAccount());
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    hidden
                    name="id"
                >
                    <Input />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Tên hiển thị"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Tuổi"
                            name="age"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tuổi!' },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[
                                { required: true, message: 'Vui lòng chọn giới tính!' },
                            ]}
                        >
                            <Select
                                placeholder="Chọn giới tính"
                                options={[
                                    { label: 'Nam', value: 'MALE' },
                                    { label: 'Nữ', value: 'FEMALE' },
                                    { label: 'Khác', value: 'OTHER' },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 24px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isSubmit ? 'not-allowed' : 'pointer',
                                opacity: isSubmit ? 0.6 : 1
                            }}
                            disabled={isSubmit}
                        >
                            {isSubmit ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

const UserChangePassword = (props: any) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        const { oldPassword, newPassword } = values;
        setIsSubmit(true);

        const res = await callChangePassword(oldPassword, newPassword);
        if (res && res.data) {
            message.success("Thay đổi mật khẩu thành công");
            form.resetFields();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="oldPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 24px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isSubmit ? 'not-allowed' : 'pointer',
                                opacity: isSubmit ? 0.6 : 1
                            }}
                            disabled={isSubmit}
                        >
                            {isSubmit ? 'Đang thay đổi...' : 'Đổi mật khẩu'}
                        </button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },

        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserChangePassword />,
        },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;