import styles from "./UserProfile.module.css";

/**
 * 사용자 프로필 컴포넌트
 */
const UserProfile = ({ loginUser }) => {
  if (!loginUser) {
    return (
      <div className={styles.profileCard}>
        <p className={styles.noData}>프로필 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileItem}>
        <span className={styles.label}>이메일</span>
        <span className={styles.value}>{loginUser.email}</span>
      </div>

      <div className={styles.profileItem}>
        <span className={styles.label}>닉네임</span>
        <span className={styles.value}>{loginUser.nickname}</span>
      </div>
    </div>
  );
};

export default UserProfile;