import { useAuth } from "../hooks/useAuth";
import UserProfile from "../components/UserProfile/UserProfile";
import styles from "./UserProfilePage.module.css";

/**
 * 사용자 프로필 페이지
 */
const UserProfilePage = () => {
  const { loginUser } = useAuth();

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h2 className={styles.title}>프로필</h2>
        <UserProfile loginUser={loginUser} />
      </div>
    </div>
  );
};

export default UserProfilePage;