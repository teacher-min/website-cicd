import { lazy } from "react";
import AuthCheckRoute from "../shared/components/AuthCheckRoute/AuthCheckRoute";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const UserProfilePage = lazy(() => import("../features/auth/pages/UserProfilePage"));

export const userRoutes = [
  //----- 공개 페이지
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
  //----- 인증이 필요한 페이지 (로그인을 해야 볼 수 있는 페이지)
  {
    path: "/profile",
    element: (
      <AuthCheckRoute>
        <UserProfilePage/>
      </AuthCheckRoute>
    ),
  },
];