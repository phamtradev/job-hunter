import { Button, Divider, Form, Input, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import { IUser } from '@/types/backend';
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
const { Option } = Select;


const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl bg-white/95 backdrop-blur rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Đăng ký tài khoản</h2>
                        <p className="text-slate-500">Nhập thông tin để tạo tài khoản mới</p>
                    </div>
                    <Button type="link" onClick={() => navigate('/login')} className="text-primary-600">
                        <ArrowLeftOutlined /> Đăng nhập
                    </Button>
                </div>
                <Form<IUser>
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                >
                    <Form.Item
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined className="text-slate-400" />}
                            placeholder="Nguyễn Văn A"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                    >
                        <Input
                            type='email'
                            size="large"
                            prefix={<MailOutlined className="text-slate-400" />}
                            placeholder="email@company.com"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="text-slate-400" />}
                            placeholder="••••••••"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                    >
                        <Input type='number' size="large" placeholder="24" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                    >
                        <Select
                            size="large"
                            allowClear
                            placeholder="Chọn giới tính"
                        >
                            <Option value="MALE">Nam</Option>
                            <Option value="FEMALE">Nữ</Option>
                            <Option value="OTHER">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                    >
                        <Input
                            size="large"
                            prefix={<HomeOutlined className="text-slate-400" />}
                            placeholder="Hà Nội, Việt Nam"
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={isSubmit} size="large" className="w-full mt-2 rounded-xl">
                        Đăng ký
                    </Button>
                    <Divider plain>Hoặc</Divider>
                    <p className="text-sm text-center text-slate-600">
                        Đã có tài khoản?
                        <Link to='/login' className="font-semibold text-primary-600 ml-1">
                            Đăng nhập
                        </Link>
                    </p>
                </Form>
            </div>
        </div>
    )
}

export default RegisterPage;