import styles from './Pagination.module.css';

/**
 * 페이지네이션 컴포넌트
 * @param {Function} onPageChange - 페이지 변경 핸들러
 * @param {Object} currentPageParams - 현재 페이징 파라미터
 * @param {Object} pageData - 서버에서 받은 페이징 데이터
 */
const Pagination = ({ onPageChange, currentPageParams, pageData }) => {
  // pageData 체크
  if ( !pageData ) {
    return null;
  }

  // pageData에 저장된 요소 꺼내기
  const { 
    number,         // 현재 페이지 번호 (0부터 시작)
    totalPages,     // 전체 페이지 수
  } = pageData;

  // 부트 서버가 제공한 현재 페이지 번호는 0으로 시작하므로 1로 조정함
  const currentPage = number + 1;
   
  /**
   * 페이지 번호를 배열로 만들어서 반환하는 함수
   * @returns {Array<number>} 페이지 번호 배열
   */
  const getPageNumbers = () => {
    const pagePerBlock = 5;
    const pages = [];

    let beginPage = Math.max(1, currentPage - Math.floor(pagePerBlock / 2));
    let endPage = Math.min(totalPages, beginPage + pagePerBlock - 1);

    // endPage의 변화에 따른 beginPage 조정
    if (endPage - beginPage < pagePerBlock - 1)
      beginPage = Math.max(1, endPage - pagePerBlock + 1);

    for (let i = beginPage; i <= endPage; i++)
      pages.push(i);

    return pages;  // return [1,2,3,4,5]
  }

  // 페이지 번호 배열
  const pages = getPageNumbers();

  /**
   * 페이지 이동 이벤트 핸들러
   * @param {number} pageNumber - 이동할 페이지 번호 (1부터 시작)
   */
  const handlePageClick = (pageNumber) => {
    // 1 페이지 ~ 마지막 페이지 사이만 이동
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange({ ...currentPageParams, page: pageNumber });
    }
  }

  return (
    <nav className={styles.pagination} >
      <ul className={styles.pageList}>
        {/* 맨 처음 페이지로 */}
        <li>
          <button
            className={styles.navButton}
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            aria-label="첫 페이지"
          >
            <span className={styles.navIcon}>«</span>
          </button>
        </li>

        {/* 이전 페이지 */}
        <li>
          <button
            className={styles.navButton}
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <span className={styles.navIcon}>‹</span>
          </button>
        </li>

        {/* 페이지 번호들 */}
        {pages.map(pageNumber => (
          <li key={pageNumber}>
            <button
              className={`${styles.pageButton} ${
                pageNumber === currentPage ? styles.active : ''
              }`}
              onClick={() => handlePageClick(pageNumber)}
              aria-label={`${pageNumber}페이지`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          </li>
        ))}

        {/* 다음 페이지 */}
        <li>
          <button
            className={styles.navButton}
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <span className={styles.navIcon}>›</span>
          </button>
        </li>

        {/* 맨 마지막 페이지로 */}
        <li>
          <button
            className={styles.navButton}
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="마지막 페이지"
          >
            <span className={styles.navIcon}>»</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;