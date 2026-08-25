import { Link } from "react-router-dom";
import styles from "./LoginForm.module.css";

/**
 * 로그인 폼 컴포넌트
 * - 이메일/비밀번호 입력
 * - 폼 제출
 */
const LoginForm = ({ formData, onChange, onSubmit, isLoading }) => {
  return (
    <div className={styles.loginForm}>
      <form onSubmit={onSubmit}>
        {/* 이메일 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="example@email.com"
            required
            disabled={isLoading}
            className={styles.input}
            autoComplete="email"
          />
        </div>
        
        {/* 비밀번호 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="비밀번호를 입력하세요"
            required
            disabled={isLoading}
            className={styles.input}
            autoComplete="current-password"
          />
        </div>
        
        {/* 로그인 버튼 */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      
      {/* 회원가입 링크 */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          계정이 없으신가요?{" "}
          <Link to="/register" className={styles.registerLink}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
