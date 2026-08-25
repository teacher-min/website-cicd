
import Pagination from "../../../../shared/components/Pagination/Pagination";
import LoadingSpinner from "../../../../shared/components/UI/LoadingSpinner/LoadingSpinner";
import styles from "./BoardList.module.css";

/**
 * 게시판 목록 컴포넌트
 */
const BoardList = ({ serverData, currentPageParams, isLoading, error, onTitleClick, onCreateClick, onPageChange  }) => {
  // serverData에서 필요한 데이터 추출
  const totalElements = serverData.data?.page?.totalElements || 0;
  const boardList = serverData.data?.content || [];
  const currentPage = serverData.data?.page?.number || 0;
  const pageSize = serverData.data?.page?.size || 10;

  /**
   * 날짜 포맷팅 함수
   * @param {string} datetime - ISO 날짜 문자열
   * @returns {string} 포맷된 날짜 문자열
   */
  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      })
    // return new Date(datetime).toLocaleString("ko-KR");
  }

  /**
   * 순번 계산 함수
   * @param {number} index - 배열 인덱스
   * @returns {number} - 화면에 표시할 순번
   */
  const calculateRowNumber = (index) => {
    return totalElements - (currentPage * pageSize) - index;
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>⚠️ {error}</p>
        <button 
          className={styles.reloadButton}
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className={styles.boardListContainer}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.totalCount}>
          총 <strong>{totalElements}</strong>개의 게시글
        </div>
        <button 
          className={styles.createButton}
          onClick={onCreateClick}
        >
          글쓰기
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className={styles.tableWrapper}>
        <table className={styles.boardTable}>
          <thead>
            <tr>
              <th className={styles.colNumber}>순번</th>
              <th className={styles.colTitle}>제목</th>
              <th className={styles.colDate}>작성일시</th>
              <th className={styles.colDate}>수정일시</th>
            </tr>
          </thead>
          <tbody>
            {boardList.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyMessage}>
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            ) : (
              boardList.map((board, index) => (
                <tr key={board.bid}>
                  <td className={styles.number}>
                    {calculateRowNumber(index)}
                  </td>
                  <td className={styles.title}>
                    <span
                      onClick={() => onTitleClick(board.bid)}
                      className={styles.titleLink}
                    >
                      {board.title}
                    </span>
                  </td>
                  <td className={styles.date}>
                    {formatDateTime(board.createdAt)}
                  </td>
                  <td className={styles.date}>
                    {formatDateTime(board.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {boardList.length > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            onPageChange={onPageChange}
            currentPageParams={currentPageParams}
            pageData={serverData.data.page}
          />
        </div>
      )}
    </div>
  );
};

export default BoardList;