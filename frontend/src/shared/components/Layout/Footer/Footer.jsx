import styles from './Footer.module.css';

/**
 * 푸터 컴포넌트
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {currentYear} Website. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;