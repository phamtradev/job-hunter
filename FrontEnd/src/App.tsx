import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callFetchAccount } from 'config/api';
import NotFound from 'components/share/not.found';
// import Loading from 'components/share/loading';
// import LoginPage from 'pages/auth/login';
// import RegisterPage from 'pages/auth/register';
// import LayoutAdmin from 'components/admin/layout.admin';
// import ProtectedRoute from 'components/share/protected-route.ts';
import Header from 'components/client/header.client';
import Footer from 'components/client/footer.client';
import HomePage from 'pages/home';
import 'styles/app.module.scss';
// import DashboardPage from './pages/admin/dashboard';
// import CompanyPage from './pages/admin/company';
// import PermissionPage from './pages/admin/permission';
// import ResumePage from './pages/admin/resume';
// import RolePage from './pages/admin/role';
// import UserPage from './pages/admin/user';

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;

    const res = await callFetchAccount();
    if (res && res.data) {
      // dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutClient />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },


      ],
    },

    // {
    //   path: "/admin",
    //   element: <LayoutAdmin />,
    //   errorElement: <NotFound />,
    //   children: [
    //     {
    //       index: true, element:
    //         <ProtectedRoute>
    //           <DashboardPage />
    //         </ProtectedRoute>
    //     },
    //     {
    //       path: "company",
    //       element:
    //         <ProtectedRoute>
    //           <CompanyPage />
    //         </ProtectedRoute>
    //     },
    //     {
    //       path: "user",
    //       element:
    //         <ProtectedRoute>
    //           <UserPage />
    //         </ProtectedRoute>
    //     },

    //     {
    //       path: "resume",
    //       element:
    //         <ProtectedRoute>
    //           <ResumePage />
    //         </ProtectedRoute>
    //     },
    //     {
    //       path: "permission",
    //       element:
    //         <ProtectedRoute>
    //           <PermissionPage />
    //         </ProtectedRoute>
    //     },
    //     {
    //       path: "role",
    //       element:
    //         <ProtectedRoute>
    //           <RolePage />
    //         </ProtectedRoute>
    //     }
    //   ],
    // },


    // {
    //   path: "/login",
    //   element: <LoginPage />,
    // },

    // {
    //   path: "/register",
    //   element: <RegisterPage />,
    // },
  ]);

  return (
    <>
      {
        // isLoading === false
        //   || window.location.pathname === '/login'
        //   || window.location.pathname === '/register'
        //   || window.location.pathname === '/'
        //   ?
        <RouterProvider router={router} />
        // :
        // <Loading />
      }
    </>
  )
}