import { useAuth } from "../../auth/hooks/useAuth";
import Home from "../components/Home/Home";
import styles from "./HomePage.module.css";

/**
 * 홈 페이지
 * 인증 여부에 따라 다른 화면 제공
 */
const HomePage = () => {
  const { isAuthenticated, loginUser } = useAuth();

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Website에 오신 것을 환영합니다!</h1>
        
        <Home 
          isAuthenticated={isAuthenticated}
          loginUser={loginUser}
        />
      </div>
    </div>
  );
};

export default HomePage;