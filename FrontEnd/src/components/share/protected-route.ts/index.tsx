import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import NotPermitted from "./not-permitted";
import Loading from "../loading";

const RoleBaseRoute = (props: any) => {
    const user = useAppSelector(state => state.account.user);
    const userRole = user.role.name;

    if (userRole !== 'NORMAL_USER') {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}

const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)
    const isLoading = useAppSelector(state => state.account.isLoading)

    return (
        <>
            {isLoading === true ?
                <Loading />
                :
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
            }
        </>
    )
}

export default ProtectedRoute;