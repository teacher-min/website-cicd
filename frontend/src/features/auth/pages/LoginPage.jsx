import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";
import styles from "./LoginPage.module.css";

/**
 * 로그인 페이지
 * - 로그인 폼 제공
 * - 로그인 성공 시 이전 페이지로 리다이렉트
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // AuthCheckRoute를 통해서 이동한 경우 전달되는 데이터
  const from = location.state?.from;
  const message = location.state?.message;
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    
  // 로그인 관련 상태와 함수 가져오기
  const { login, isLoading, error, clearError } = useAuth();

  // 페이지 로드 시 에러 메시지 초기화
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  // message가 있으면 경고창 표시
  useEffect(() => {
    if (message) {
      window.alert(message);
    }
  }, [message]);

  /**
   * 로그인 제출 핸들러
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData);
      // 로그인 성공 시 원래 가려던 페이지로 이동
      const redirectURL = from?.pathname || "/";
      navigate(redirectURL, { replace: true });
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  /**
   * 입력값 변경 핸들러
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 제거
    if (error) {
      clearError();
    }
  };

return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h2 className={styles.title}>로그인</h2>
          <p className={styles.subtitle}>계정에 로그인하세요</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.errorAlert} role="alert">
            <span className={styles.errorText}>{error}</span>
            <button 
              className={styles.errorClose}
              onClick={clearError}
              aria-label="에러 메시지 닫기"
            >
              ✕
            </button>
          </div>
        )}

        <LoginForm 
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LoginPage;