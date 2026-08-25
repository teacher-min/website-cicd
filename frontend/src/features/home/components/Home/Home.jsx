import { Link } from "react-router-dom";
import styles from "./Home.module.css";

/**
 * 홈 컴포넌트
 * - 인증 여부에 따라 다른 컨텐츠 표시
 */
const Home = ({ isAuthenticated, loginUser }) => {
  return (
    <div className={styles.homeContent}>
      {isAuthenticated ? (
        <div className={styles.section}>
          <p className={styles.greeting}>
            안녕하세요, <strong>{loginUser?.nickname}</strong>님!
          </p>
          
          <p className={styles.description}>
            원하시는 서비스를 선택해주세요
          </p>
          
          <div className={styles.buttonGroup}>
            <Link to="/profile" className={styles.profileButton}>
              프로필
            </Link>
            <Link to="/boards" className={styles.boardButton}>
              게시판
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.section}>
          <p className={styles.greeting}>
            환영합니다!
          </p>
          
          <p className={styles.description}>
            시작하려면 로그인하거나 회원가입하세요
          </p>
          
          <div className={styles.buttonGroup}>
            <Link to="/login" className={styles.loginButton}>
              로그인
            </Link>
            <Link to="/register" className={styles.registerButton}>
              회원가입
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
