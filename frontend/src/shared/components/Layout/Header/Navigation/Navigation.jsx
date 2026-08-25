import { Link } from "react-router-dom";
import { useAuth } from "../../../../../features/auth/hooks/useAuth";
import styles from "./Navigation.module.css";

/**
 * 네비게이션 컴포넌트
 */
const Navigation = () => {
  // store가 관리하는 상태와 함수 가져오기 (인증 상태라면 user 정보와 로그아웃 버튼 보여주기)
  const { loginUser, isAuthenticated, logout } = useAuth();

  /**
   * 로그아웃 이벤트 핸들러
   */
  const handleLogout = () => {
    logout();
  };

   return (
    <nav className={styles.nav}>
      {/* 로고 */}
      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>
          Website
        </Link>
      </div>
      
      {/* 메뉴 */}
      <div className={styles.menu}>
        {isAuthenticated ? (
          <>
            <span className={styles.greeting}>
              {loginUser?.nickname}님
            </span>
            <Link to="/profile" className={styles.link}>
              프로필
            </Link>
            <Link to="/boards" className={styles.link}>
              게시판
            </Link>
            <button 
              onClick={handleLogout} 
              className={styles.logoutButton}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              로그인
            </Link>
            <Link to="/register" className={styles.link}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
