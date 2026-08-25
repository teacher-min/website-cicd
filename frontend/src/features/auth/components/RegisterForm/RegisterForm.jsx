import { Link } from "react-router-dom";
import styles from "./RegisterForm.module.css";

/**
 * 회원가입 폼 컴포넌트
 * - 이메일, 비밀번호, 닉네임 필수 입력
 */
const RegisterForm = ({ formData, onChange, onSubmit, isLoading }) => {
  return (
    <div className={styles.registerForm}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일 <span className={styles.required}>*</span>
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
        
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호 <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            disabled={isLoading}
            className={styles.input}
            autoComplete="new-password"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="nickname" className={styles.label}>
            닉네임 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={onChange}
            placeholder="사용할 닉네임을 입력하세요"
            required
            disabled={isLoading}
            className={styles.input}
            autoComplete="username"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "회원가입 처리 중..." : "회원가입"}
        </button>
      </form>
      
      <div className={styles.footer}>
        <p className={styles.footerText}>
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className={styles.loginLink}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
