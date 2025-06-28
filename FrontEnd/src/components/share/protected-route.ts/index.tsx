import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import NotPermitted from "./not-permitted";

const RoleBaseRoute = (props: any) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useAppSelector(state => state.account.user);
    const userRole = user.role;

    if (isAdminRoute && userRole === 'ADMIN' ||
        !isAdminRoute && (userRole === 'USER' || userRole === 'ADMIN')
    ) {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}

const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)

    return (
        <>
            {isAuthenticated === true ?
                <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>
                </>
                :
                <Navigate to='/login' replace />
            }
        </>
    )
}

export default ProtectedRoute;