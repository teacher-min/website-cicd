import { useSelector, useDispatch } from "react-redux";
import { loginUserAction, registerUserAction, logout, clearError, clearLogoutFlag } from "../slices/authSlice";
import store from "../../../store";
import { useEffect } from "react";

/**
 * 사용자 처리 커스텀 훅
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  // store가 관리하는 상태 가져오기
  const { loginUser, isAuthenticated, isLoading, error, justLoggedOut } = useSelector(state => state.auth);  // store의 reducer중 auth: authReducer를 선택

  // 로그아웃 후 플래그 초기화
  useEffect(() => {
    if (justLoggedOut) {
      const timer = setTimeout(() => {
        dispatch(clearLogoutFlag());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [justLoggedOut, dispatch]);

  /**
   * 로그아웃 함수
   */
  const handleLogout = () => {
    // Redux 로그아웃
    dispatch(logout());
  };

  /**
   * 회원가입 함수
   * 
   * @param { object } userData - 회원가입 하려는 사용자 {"email": "", "password": "", "nickname": ""}
   * @returns 서버가 반환한 응답 데이터 { accessToken: "...", refreshToken: "...", userInfo: { email: "...", nickname: "...", ... } }
   */
  const register = async (userData) => {
    // 회원가입 후 서버의 응답 데이터 받아오기 (Promise)
    const result = await dispatch(registerUserAction(userData));
    if (registerUserAction.rejected.match(result)) {
      throw new Error(result.payload);  // new Error("회원가입이 실패했습니다.");
    }
    // 서버의 응답 데이터 반환 (Data)
    return result.payload;
  };


  /* 
   * 코드 이해하기
   * const result = await dispatch(registerUserAction(userData));
   *        
   * 1. 함수 호출
   *    1) authSlice.js 파일의 registerUserAction 액션 함수 호출
   *    2) dispatch 함수가 있어야만 액션 함수 호출이 가능함
   * 
   * 2. 반환값
   *    1) registerUserAction 액션 함수의 반환값 = "return { ...responseData, userInfo, }"
   *    2) 실제 반환값은 Promise로 Wrapping 되어 있음
   *    3) await 키워드를 이용해서 Promise에서 반환값을 추출
   *    4) 추출된 결과값 중 payload가 실제 registerUserAction 액션 함수의 반환값을 가진 프로퍼티
   *
   *   참고1) Promise로 Wrapping된 반환값
   *    Promise {
   *      arg: {email: "user@example.com", password: "1111", nickname: "유저"},
   *      PromiseResult: {
   *        meta: { arg: userData, requestId: "abc123", requestStatus: "fulfilled" }
   *        payload: { accessToken: "...", refreshToken: "...", userInfo: { email: "user@example.com", nickname: "유저", ... } },
   *        type: "auth/register/fulfilled"
   *      },
   *    }
   * 
   *    참고2) await으로 Promise에서 꺼낸 결과값
   *    {
   *      meta: { arg: userData, requestId: "abc123", requestStatus: "fulfilled" }
   *      payload: { accessToken: "...", refreshToken: "...", userInfo: { email: "user@example.com", nickname: "유저", ... } },
   *      type: "auth/register/fulfilled"
   *    }
   */

  /**
   * 로그인 함수
   * 
   * @param { object } credentials - 로그인 하려는 사용자 {"email": "", "password": ""}
   * @returns 서버가 반환한 응답 데이터
   */ 
  const login = async (credentials) => {
    // 로그인 수행 후 서버의 응답 데이터 받아오기
    const result = await dispatch(loginUserAction(credentials));
    if (loginUserAction.rejected.match(result)) {
      throw new Error(result.payload);
    }

    // 서버의 응답 데이터 확인 (디버깅용)
    console.log("로그인 결과 확인");
    console.log(result);
    console.log(result.payload);
    // 상태 확인 (디버깅용)
    const state = store.getState();
    console.log("store 상태 확인");
    console.log(state.auth);
    
    // 서버의 응답 데이터 반환
    return result.payload;
  };
  
  /**
   * 에러 메시지 초기화 함수
   */
  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    // 상태 반환
    loginUser,
    isAuthenticated,
    isLoading,
    error,
    // 함수 반환
    login,
    register,
    logout: handleLogout,
    clearError: handleClearError,
  };
  
};
