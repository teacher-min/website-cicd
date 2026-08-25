import { useParams } from "react-router-dom";
import { getBoard, deleteBoard } from "../api/boardAPI";
import useBoardNavigate from "../hooks/useBoardNavigate";
import { useState, useEffect, useCallback } from "react";
import BoardDetail from "../components/BoardDetail/BoardDetail";
import styles from "./BoardDetailPage.module.css";

/**
 * 게시글 상세 페이지
 */
const BoardDetailPage = () => {
  // URL 파라미터에서 게시글 ID 가져오기
  const { bid } = useParams();

  // 네비게이션 훅
  const { goBack, goToUpdatePage } = useBoardNavigate();
  
  // 상태 관리
  const [board, setBoard] = useState({
    bid: 0,
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 게시글 상세 정보 가져오기
   */
  const loadBoard = useCallback(async () => {
    if (!bid) {
      setError("게시글 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const responseData = await getBoard(bid);
      setBoard(responseData.data);
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      const errorMessage = error.response?.data?.message || `게시글 ID = ${bid}인 게시글을 불러오는데 실패했습니다.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [bid]);

  /**
   * 컴포넌트 마운트 시 게시글 로드
   */
  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  /**
   * 게시글 삭제 핸들러
   */
  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    try {
      const responseData = await deleteBoard(bid);
      window.alert(responseData.message || "게시글이 삭제되었습니다.");
      goBack();  // 이전 페이지로 이동
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      window.alert("게시글 삭제에 실패했습니다.");
    }
  };

  /**
   * 수정 페이지로 이동 핸들러
   */
  const handleEdit = () => {
    goToUpdatePage(bid);
  };

  /**
   * 목록으로 이동 핸들러
   */
  const handleGoToList = () => {
    goBack();
  };

  return (
    <div className={styles.boardDetailPage}>
      <div className={styles.container}>
        <BoardDetail 
          board={board}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onGoToList={handleGoToList}
        />
      </div>
    </div>
  );
}

export default BoardDetailPage;