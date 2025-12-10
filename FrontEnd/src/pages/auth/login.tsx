import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { useAppSelector } from '@/redux/hooks';
import { LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/';
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
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
                        <h2 className="text-2xl font-semibold text-slate-900">Đăng nhập</h2>
                        <p className="text-slate-500">Tiếp tục hành trình ứng tuyển của bạn</p>
                    </div>
                    <Button type="link" onClick={() => navigate('/register')} className="text-primary-600">
                        Tạo tài khoản
                    </Button>
                </div>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                >
                    <Form.Item
                        label="Email"
                        name="username"
                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                    >
                        <Input
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

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmit}
                        size="large"
                        className="w-full mt-2 rounded-xl"
                    >
                        Đăng nhập
                    </Button>

                    <Divider plain>Hoặc</Divider>
                    <p className="text-sm text-center text-slate-600">
                        Chưa có tài khoản?
                        <Link className="font-semibold text-primary-600 ml-1" to='/register'>
                            Đăng ký <ArrowRightOutlined />
                        </Link>
                    </p>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage;