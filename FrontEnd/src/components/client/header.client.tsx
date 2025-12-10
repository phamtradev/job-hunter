import { useState, useEffect } from 'react';
import { CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, TwitterOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message, Button } from 'antd';
import { Menu } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];



    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        ...(user.role?.permissions?.length ? [{
            label: <Link
                to={"/admin"}
            >Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />
        },] : []),

        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <header className="sticky top-0 z-50">
                <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur border-b border-slate-800">
                    <div className="absolute inset-x-0 -top-12 h-28 bg-gradient-to-r from-primary-500/25 via-emerald-400/20 to-indigo-400/25 blur-3xl animate-pulse-soft pointer-events-none" />
                    <div className="page-container h-14 sm:h-16 flex items-center justify-between gap-4 relative">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate('/')}
                                title="Job Hunter"
                            >
                                <FaReact style={{ color: '#61dafb', fontSize: 28 }} />
                            </div>
                            {!isMobile && (
                                <nav className="hidden sm:flex items-center">
                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        className="header-menu bg-transparent text-slate-200 border-none"
                                    />
                                </nav>
                            )}
                        </div>

                        {!isMobile && (
                            <div className="flex items-center gap-3">
                                {isAuthenticated === false ? (
                                    <>
                                        <Button type="text" onClick={() => navigate('/login')} className="text-slate-200">
                                            Đăng Nhập
                                        </Button>
                                        <Button type="primary" onClick={() => navigate('/register')} className="rounded-full px-4">
                                            Đăng Ký
                                        </Button>
                                    </>
                                ) : (
                                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                        <Space className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-100 cursor-pointer hover:bg-slate-800 transition">
                                            <span>Chào, {user?.name}</span>
                                            <Avatar className="bg-primary-600">
                                                {user?.name?.substring(0, 2)?.toUpperCase()}
                                            </Avatar>
                                        </Space>
                                    </Dropdown>
                                )}
                            </div>
                        )}

                        {isMobile && (
                            <div className="flex items-center gap-3">
                                {isAuthenticated && (
                                    <Avatar className="bg-primary-600">
                                        {user?.name?.substring(0, 2)?.toUpperCase()}
                                    </Avatar>
                                )}
                                <MenuFoldOutlined
                                    onClick={() => setOpenMobileMenu(true)}
                                    className="text-xl text-slate-200"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;