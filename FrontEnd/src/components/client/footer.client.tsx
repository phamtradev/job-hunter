import { Row, Col } from 'antd';
import { FacebookOutlined, YoutubeOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import styles from '@/styles/client.module.scss';

const Footer = () => {
    return (
        <footer className={styles["footer-section"]}>
            <div className={styles["container"]}>
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={12} md={6}>
                        <h3>Về Chúng Tôi</h3>
                        <p>
                            Nền tảng tuyển dụng IT hàng đầu Việt Nam, kết nối người tìm việc với các công ty công nghệ hàng đầu.
                        </p>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <h3>Liên Kết</h3>
                        <ul>
                            <li><a href="/">Trang Chủ</a></li>
                            <li><a href="/job">Việc Làm IT</a></li>
                            <li><a href="/company">Top Công Ty IT</a></li>
                        </ul>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <h3>Hỗ Trợ</h3>
                        <ul>
                            <li><a href="#">Hướng Dẫn</a></li>
                            <li><a href="#">Liên Hệ</a></li>
                            <li><a href="#">Điều Khoản Sử Dụng</a></li>
                            <li><a href="#">Chính Sách Bảo Mật</a></li>
                        </ul>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <h3>Kết Nối Với Chúng Tôi</h3>
                        <div className={styles["social-icons"]}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FacebookOutlined />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <YoutubeOutlined />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <LinkedinOutlined />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <GithubOutlined />
                            </a>
                        </div>
                    </Col>
                </Row>
                <div className={styles["footer-bottom"]}>
                    <p>&copy; {new Date().getFullYear()} Job Hunter. All rights reserved. Made with ❤️ by phamtradev</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;