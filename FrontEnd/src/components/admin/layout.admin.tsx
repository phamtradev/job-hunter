import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
// import { doLogoutAction } from '@/redux/account/accountSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';

import type { MenuProps } from 'antd';

const { Content, Footer, Sider } = Layout;



const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useAppSelector(state => state.account.user);

    const [showManageAccount, setShowManageAccount] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            // dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const items: MenuProps['items'] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to='/admin/company'>Company</Link>,
            key: 'company',
            icon: <BankOutlined />,
        },
        {
            label: <Link to='/admin/user'>User</Link>,
            key: 'user',
            icon: <UserOutlined />
        },
        {
            label: <Link to='/admin/resume'>Resume</Link>,
            key: 'resume',
            icon: <AliwangwangOutlined />
        },
        {
            label: <Link to='/admin/permission'>Permission</Link>,
            key: 'permission',
            icon: <ApiOutlined />
        },
        {
            label: <Link to='/admin/role'>Role</Link>,
            key: 'role',
            icon: <ExceptionOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setShowManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    // const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                {!isMobile ?
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            Admin
                        </div>
                        <Menu
                            defaultSelectedKeys={[activeMenu]}
                            mode="inline"
                            items={items}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    :
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                }

                <Layout>
                    {!isMobile &&
                        <div className='admin-header'>
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    ádfasdfasdf
                                    {/* <Avatar src={urlAvatar} />
                                {user?.fullName} */}
                                </Space>
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    {/* <Footer style={{ padding: 0 }}>
                    React Test Fresher &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                </Footer> */}
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;