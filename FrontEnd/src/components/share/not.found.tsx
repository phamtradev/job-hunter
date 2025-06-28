import { useNavigate } from "react-router-dom";
import { Button, Result } from 'antd';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary"
                    onClick={() => navigate('/')}
                >Back Home</Button>}
            />
        </>
    )
}

export default NotFound;