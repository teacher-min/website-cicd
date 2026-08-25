/**
 * axios 전역 설정 파일
 */ 
import axios from "axios";
import CookieUtils from "../utils/cookies";

// frontend/.env 파일의 환경 변수를 참조하거나, http://localhost:8080 주소를 사용
const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST || "http://localhost:8080";

//----- axios 커스텀 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_SERVER_HOST,
  timeout: 10000,
})

/**
 * 요청 인터셉터
 * accessToken 쿠키를 가져와서 Authorization 헤더에 포함 (인증된 사용자만 요청 가능하도록)
 * 인증이 필요 없는 요청은 accessToken 쿠키를 헤더에 담을 필요 없음
 */
apiClient.interceptors.request.use(
  // 요청 성공 시
  (config) => {
    // 회원가입, 로그인은 accessToken이 없는 상태에서 요청하는 작업
    const notRequiredTokenPaths = [
      "/api/auth/register",
      "/api/auth/login",
    ];

    // 인증이 필요 없으면 true
    const isNotRequiredToken = notRequiredTokenPaths.some(path => config.url?.includes(path));

    // 인증이 필요하면 accessToken을 헤더로 보내기
    if ( !isNotRequiredToken ) {
      // accessToken 쿠키 가져오기
      const accessToken = CookieUtils.get("accessToken");
  
      // accessToken 쿠키가 있으면 Authorization 헤더에 추가
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // 요청 설정 반환
    return config;
  },
  // 요청 실패 시
  (error) => {
    console.error("요청 실패:", error);
    return Promise.reject(error);
  }
)

// store 순환 참조 방지
let store;
export const setStore = (storeInstance) => {
  store = storeInstance;
}

/**
 * 응답 인터셉터
 * 401 Unauthorized 발생 시 로그아웃
 */
apiClient.interceptors.response.use(
  // 응답 성공 시
  (response) => {
    return response;
  },
  // 응답 실패 시
  async (error) => {
    // 토큰 갱신 후 재요청을 위해서 원래 요청 정보를 저장
    const originalRequest = error.config;
    console.log("응답 실패. originalRequest:", originalRequest);

    if ( error.response ) {
      // 1. 서버가 응답했으나 2xx 범위가 아님
      // 응답코드
      const status = error.response.status;
      // 401 Unauthorized. 토큰이 만료되거나, 유효하지 않은 경우
      if (status === 401 && !originalRequest._retry) {
        // 로그아웃 (동적 import로 순환 참조 방지: store를 받고나서 import 하기)
        if (store) {
          import("../../features/auth/slices/authSlice")
            .then(({ logout }) => {
              store.dispatch(logout());
            })
        }
        // 로그인 페이지로 이동
        window.location.href = "/login";
      } else if (status === 403) {
        // 권한 부족
      } else if (status === 404) {
        // Not Found
      } else if (status >= 400 && status < 500) {
        // 기타 4xx (401 Bad Request 등)
      } else if (status >= 500) {
        // 서버 오류
      }
    } else if ( error.request ) {
      // 2. 서버로 요청했으나 응답이 없음
    } else {
      // 3. 요청 설정 중 문제
    }
    return Promise.reject(error);
  }
)

// default export
export default apiClient;