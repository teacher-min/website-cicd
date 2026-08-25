import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useSelector } from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 * @param { ReactNode } children - 보호할 컴포넌트
 */
const AuthCheckRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const justLoggedOut = useSelector(state => state.auth.justLoggedOut);

  // 로딩 중이면 LoadingSpinner
  if ( isLoading ) {
    return <LoadingSpinner/>;
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  // 현재 위치(location)를 state로 전달하여 로그인 후 현재 위치로 되돌아 올 수 있도록 설정함
  // 방금 로그아웃했다면 <Navigate to="/login"> 동작하지 않도록 처리
  if ( !isAuthenticated ) {
    // 방금 로그아웃했다면,
    if ( justLoggedOut ) {
      return <Navigate to="/" replace />;
    }
    return (
      <Navigate
        to="/login"
        state={{ 
          from: location,  // 현재 위치를 저장
          message: "로그인이 필요한 페이지입니다.",
        }}
        replace
      />
    );
  }

  // 인증된 사용자는 원하는 컴포넌트를 보여줌
  return children;
};

export default AuthCheckRoute;