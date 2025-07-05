import { Col, Row } from 'antd';
import styles from 'styles/client.module.scss';
import CompanyCard from '@/components/client/card/company.card';

const ClientCompanyPage = (props: any) => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CompanyCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientCompanyPage;