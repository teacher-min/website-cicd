import LoadingSpinner from "../../../../shared/components/UI/LoadingSpinner/LoadingSpinner";
import styles from "./BoardDetail.module.css";

/**
 * 게시글 상세 컴포넌트
 */
const BoardDetail = ({ board, isLoading, error, onDelete, onEdit, onGoToList }) => {
  /**
   * 날짜 포맷팅 함수
   */
  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    
    return new Date(datetime).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
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
        <p className={styles.errorText}>{error}</p>
        <button 
          className={styles.listButton}
          onClick={onGoToList}
        >
          목록으로
        </button>
      </div>
    );
  }

  // 게시글이 없는 경우
  if (!board || !board.bid) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>게시글을 찾을 수 없습니다.</p>
        <button 
          className={styles.listButton}
          onClick={onGoToList}
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className={styles.boardDetailContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{board.title}</h2>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>작성일</span>
            <span className={styles.metaValue}>
              {formatDateTime(board.createdAt)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>수정일</span>
            <span className={styles.metaValue}>
              {formatDateTime(board.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className={styles.content}>
        {board.content || '내용이 없습니다.'}
      </div>

      {/* 버튼 그룹 */}
      <div className={styles.buttonGroup}>
        <button 
          className={styles.listButton}
          onClick={onGoToList}
        >
          목록으로
        </button>
        <div className={styles.actionButtons}>
          <button 
            className={styles.editButton}
            onClick={onEdit}
          >
            수정
          </button>
          <button 
            className={styles.deleteButton}
            onClick={onDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;