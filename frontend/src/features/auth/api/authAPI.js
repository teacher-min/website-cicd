import apiClient from "../../../shared/api/axiosConfig";

const AUTH_BASE_PATH = "/api/auth";

/**
 * 회원가입 함수
 * @param {object} userData - 회원가입 하려는 사용자 {"email": "", "password": "", "nickname": ""}
 * @returns 
 */
export const register = async (userData) => {
  const response = await apiClient.post(`${AUTH_BASE_PATH}/register`, userData);
  return response.data;
}

/**
 * 로그인 함수
 * @param {object} credentials - 로그인 하려는 사용자 {"email": "", "password": ""}
 * @returns 서버의 응답 데이터
 */
export const login = async (credentials) => {
  const response = await apiClient.post(`${AUTH_BASE_PATH}/login`, credentials);
  return response.data;
}

/**
 * 로그아웃 함수 (선택사항 - 사용 안하는 중...)
 */
export const logout = async () => {
  const response = await apiClient.post(`${AUTH_BASE_PATH}/logout`);
  return response.data;
}