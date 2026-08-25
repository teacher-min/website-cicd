import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from '../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';

/**
 * 회원가입 페이지
 * - 회원가입 폼(이메일, 비밀번호, 닉네임)
 * - 회원가입 성공 시 메인 페이지로 이동
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  
  // 회원가입 관련 상태와 함수
  const { register, isLoading, error, clearError } = useAuth();

  // 페이지 로드 시 에러 초기화
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  /**
   * 입력값 변경 핸들러
   * - 입력 시 에러 메시지 초기화
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      clearError();
    }
  };

  /**
   * 회원가입 폼 제출 핸들러
   * - 데이터 흐름: RegisterPage.jsx => useAuth.js => authSlice.js
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const responseRegister = await register(formData);
      console.log("Register.jsx:", responseRegister);
      navigate("/");  // 회원가입 후 메인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <h2 className={styles.title}>회원가입</h2>
          <p className={styles.subtitle}>새로운 계정을 만드세요</p>
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

        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RegisterPage;