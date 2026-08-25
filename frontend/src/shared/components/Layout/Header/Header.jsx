import Navigation from "./Navigation/Navigation";
import styles from './Header.module.css';

/**
 * 헤더 컴포넌트
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <Navigation/>
    </header>
  );
};

export default Header;