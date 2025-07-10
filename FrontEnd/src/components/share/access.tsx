import { useEffect, useRef, useState } from 'react';
import { Result } from "antd";
import { useAppSelector } from '@/redux/hooks';
import { FaSlidersH } from 'react-icons/fa';

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: { method: string, apiPath: string, module: string };
}

function getPathFromUrl(url: string) {
    return url.split(/[?#]/)[0];
}

export const API_LIST = {
    APP_DETAIL: {
        // method: API_URLS..g.method,
        // path: getPathFromUrl()
    },
}


const Access = (props: IProps) => {
    //set default: hideChildren = false => vẫn render children
    // hideChildren = true => ko render children, ví dụ hide button (button này check quyền)
    const { permission, hideChildren = false } = props;
    const [allow, setAllow] = useState<boolean>(true);

    const permissions = useAppSelector(state => state.account.user.role.permissions);


    useEffect(() => {
        if (permissions?.length) {
            const check = permissions.find(item =>
                item.apiPath === permission.apiPath
                && item.method === permission.method
                && item.module === permission.module
            )
            if (check) {
                setAllow(true)
            } else
                setAllow(false);
        }
    }, [permissions])

    return (
        <>
            {allow === true || import.meta.env.VITE_ACL_ENABLE === 'false' ?
                <>{props.children}</>
                :
                <>
                    {hideChildren === false ?
                        <Result
                            status="403"
                            title="Truy cập bị từ chối"
                            subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
                        />
                        :
                        <>
                            {/* render nothing */}
                        </>
                    }
                </>
            }
        </>

    )
}

export default Access;