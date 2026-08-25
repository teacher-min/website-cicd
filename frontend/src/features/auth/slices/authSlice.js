import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { register, login } from "../api/authAPI";
import CookieUtils from "../../../shared/utils/cookies";
import JwtUtils from "../../../shared/utils/jwtUtils";


/*
  === Redux State
  1. 휘발성: 새로고침 시 사라짐
  2. 인메모리: 메모리에 있어 접근 속도 빠름
  3. 컴포넌트 간 공유: 모든 컴포넌트에서 접근 가능

  === 쿠키
  1. 비휘발성: 새로고침해도 유지됨
  2. 인디스크: 디스크에 있어 상대적으로 느림
  3. 크키 제한: 4KB

  === 새로고침 시 상태 복원 전략
  1. 쿠키에 JWT 토큰만 저장 (비휘발성)
  2. 새로고침 시 JWT 토큰에서 상태값(사용자 정보)을 꺼낸 뒤 initialState로 저장 
  3. Redux store 생성 (사용자 정보를 모든 컴포넌트에서 접근 가능)
*/

/**
 * accessToken 쿠키로부터 사용자 정보 복원
 * @returns {object|null} - JWT 토큰으로부터 복원된 사용자 정보 반환
 */
const getUserInfoFromToken = () => {
  const accessToken = CookieUtils.get("accessToken");
  // 토큰 체크
  if (!accessToken) {
    return null;
  }
  // 토큰 만료 체크
  if (JwtUtils.isTokenExpired(accessToken)) {
    console.log("쿠키에 저장된 JWT 토큰 만료됨");
    CookieUtils.remove("accessToken");
    return null;
  }
  // 사용자 정보 반환
  return JwtUtils.getUserInfo(accessToken);
}

/**
 * 회원가입 (비동기 액션)
 * 회원가입 후 JWT 토큰을 쿠키에 저장 (이 방식은 회원가입하면 곧바로 로그인이 됩니다.)
 */
export const registerUserAction = createAsyncThunk(
  "auth/register",  // 액션 타입
  async (userData, { rejectWithValue }) => {
    try {
      // 회원가입 시도
      const responseData = await register(userData);
      // 회원가입 성공시 JWT 토큰을 쿠키에 저장
      CookieUtils.set("accessToken", responseData.accessToken, {
        expires: 1,      // 1일 후 만료
        secure: false,   // 개발환경 (http 쿠키 전송 가능)
        sameSite: "lax", // 안전한 요청은 쿠키 전송 가능
      });
      // JWT 토큰에서 사용자 정보 복원
      const userInfo = JwtUtils.getUserInfo(responseData.accessToken);
      // 회원가입 성공시 서버의 응답 데이터 + JWT 토큰에서 추출한 사용자 정보를 반환 (fulfilled 액션의 payload가 됩니다.)
      return {
        ...responseData,
        userInfo,
      }
    } catch (error) {
      // 회원가입 실패시 예외 메시지를 반환 (rejected 액션의 payload가 됩니다.)
      return rejectWithValue(
        error.response?.data?.message || "회원가입이 실패했습니다."
      );
    }
  }
)

/**
 * 로그인 (비동기 액션)
 * 사용자 로그인 처리 후 JWT 토큰을 쿠키에 저장
 */
export const loginUserAction = createAsyncThunk(
  "auth/login", // 액션 타입 이름
  async (credentials, { rejectWithValue }) => {
    try {
      // API 호출로 로그인 시도
      const responseData = await login(credentials);
      // 로그인 성공 시 JWT 토큰을 쿠키에 저장
      CookieUtils.set("accessToken", responseData.accessToken, {
        expires: 1,      // 1일 후 만료
        secure: false,   // 개발환경 (http 쿠키 전송 가능)
        sameSite: "lax", // 안전한 요청은 쿠키 전송
      });
      // JWT 토큰에서 사용자 정보 복원
      const userInfo = JwtUtils.getUserInfo(responseData.accessToken);
      // 로그인 성공 시 서버의 응답 데이터 + JWT 토큰에서 추출한 사용자 정보를 반환 (fulfilled 액션의 payload가 됩니다.)
      return {
        ...responseData,
        userInfo,
      }
    } catch (error) {
      // 로그인 실패 시 예외 메시지를 반환 (rejected 액션의 payload가 됩니다.)
      return rejectWithValue(
        error.response?.data?.message || '로그인에 실패했습니다.'
      );
    }
  }
);

/**
 * 리덕스 초기 상태 (새로고침할때마다 createSlice() 함수가 동작하면서 리덕스 초기 상태를 가짐)
 */
const initialState = {
  loginUser: getUserInfoFromToken(),                  // 로그인 상태의 사용자 정보 (토큰에서 복원한 사용자 정보)
  accessToken: CookieUtils.get("accessToken"),        // 액세스 토큰
  isAuthenticated: !!CookieUtils.get("accessToken"),  // 인증 여부 (boolean), Boolean(CookieUtils.get("accessToken"))와 동일한 코드
  error: null,                                        // 에러 메시지
  isLoading: false,                                   // 로딩 상태 여부 (API 처리중인지 처리완료인지 구분)
  justLoggedOut: false,                               // 방금 로그아웃했는지 여부
};

/**
 * Auth Slice 정의
 * 
 * createSlice() 함수는 다음을 자동으로 생성합니다.
 * 1. 액션 생성자 (action creators)
 * 2. 리듀서 함수 (reducer function)
 * 3. 액션 타입 상수 (action type constants)
 */
const authSlice = createSlice({
  name: "auth",  // 슬라이스 이름 (액션 타입의 prefix 값으로 사용)
  initialState,  // 초기상태
  reducers: {    // 동기 액션들을 정의. 자동으로 액션 생성자가 생성됨
    /**
     * 로그아웃 액션
     * 
     * - 액션 타입  : "auth/logout" <- "슬라이스이름/액션이름"
     * - 액션 생성자: logout() - 자동으로 생성되는 함수
     * - 컴포넌트에서 액션 생성자를 호출할 때 (실행하고 싶을 때)
     *   dispatch(logout()) -> dispatch({type: "logout"})
     */
    logout: (state) => {
      // 리덕스 툴킷의 경우 Immer 라이브러리가 직접 state를 수정하더라도 새로운 state를 반환하는 방식으로 처리합니다.
      state.loginUser = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      state.justLoggedOut = true;
      // accessToken 쿠키 제거
      CookieUtils.remove("accessToken");
    },

    /**
     * 로그아웃 플래그 초기화 액션
     */
    clearLogoutFlag: (state) => {
      state.justLoggedOut = false;
    },

    /**
     * 에러 초기화 액션
     * 폼에 표시된 에러 메시지를 지우기 위해 사용
     * 
     * - 액션 타입: "auth/clearError" <- "슬라이스이름/액션이름"
     * - 액션 생성자: clearError() - 자동으로 생성되는 함수
     * - 컴포넌트에서 액션 생성자를 호출할 때 (실행하고 싶을 때)
     *   dispatch(clearError()) -> dispatch({type: "clearError"})
     */
    clearError: (state) => {
      state.error = null;  // 에러 메시지 초기화
    },
  },
  extraReducers: (builder) => {  // 외부에서 생성한 액션 정의(주로 createAsyncThunk를 이용한 비동기 액션)
 
    // createAsyncThunk() 함수는 3개의 액션을 자동으로 생성합니다.
    // 1. auth/register/pending   - 요청 시작
    // 2. auth/register/fulfilled - 요청 성공
    // 3. auth/register/rejected  - 요청 실패

    // 회원가입 (pending, fulfilled, rejected)
    builder
      .addCase(registerUserAction.pending, (state) => {
        state.error = null;  // 에러 메시지 초기화
        state.isLoading = true;  // 로딩 화면 활성화 (로딩 스피너 활용 가능)
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.loginUser = action.payload.userInfo;  // 토큰에서 추출한 정보(action.payload에는 createAsyncThunk() 함수에서 반환한 API 응답 데이터가 저장)
        state.accessToken = action.payload.accessToken;  // 토큰 저장
        state.isAuthenticated = true;  // 인증 성공
        state.isLoading = false;  // 로딩 화면 비활성화
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.error = action.payload;  // action.payload에는 rejectWithValue() 함수로 전달된 메시지가 저장
        state.isLoading = false;  // 로딩 화면 비활성화
      });

    // 로그인 (pending, fulfilled, rejected)
    builder
      .addCase(loginUserAction.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.loginUser = action.payload.userInfo;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });

  }

});

/**
 * 액션 생성자를 export
 * authSlice.actions에는 reducers에 정의한 함수들이
 * 액션 생성자로 자동 변환되어 있습니다.
 */
export const { logout, clearError, clearLogoutFlag } = authSlice.actions;

/**
 * 리듀서 함수를 default export
 * 이 리듀서는 store에서 사용합니다.
 */
export default authSlice.reducer;

/*
1. index.jsx 실행
   ↓
2. App.jsx import
   ↓
3. store.js import
   ↓
4. authSlice.js import
   ↓
5. getUserFromToken() 실행 ✅ (쿠키에서 토큰 복원)
   ↓
6. initialState 객체 생성 ✅
   ↓
7. createSlice() 실행 ✅ (reducer와 actions 생성)
   ↓
8. configureStore() 실행 (store 생성)
   ↓
9. Provider로 store 전달
   ↓
10. React 컴포넌트 렌더링 시작
*/

/*
로그인 폼 제출
↓
loginUserAction 디스패치
↓
서버 응답: { accessToken, refreshToken }
↓
쿠키에 accessToken 저장
↓
Redux state 업데이트: { loginUser: {...}, isAuthenticated: true }
*/

/*
F5 눌림
↓
React 앱 완전 재시작
↓
authSlice.js 로드
↓
getUserFromToken() 실행 ✅
  → 쿠키에서 accessToken 가져옴
  → JWT 디코딩하여 사용자 정보 추출
↓
initialState 생성 ✅
  → loginUser: { email: "...", nickname: "..." }
  → isAuthenticated: true
↓
createSlice() 실행 ✅
  → reducer와 actions 생성
↓
Redux store 생성 (복원된 상태로)
↓
App 렌더링 (로그인 상태 유지됨)
*/