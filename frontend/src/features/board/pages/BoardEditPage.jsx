import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoard, updateBoard } from "../api/boardAPI";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner/LoadingSpinner";
import BoardForm from "../components/BoardForm/BoardForm";
import styles from "./BoardEditPage.module.css";

/**
 * 게시글 수정 페이지
 */
const BoardEditPage = () => {
  const { bid } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [originalData, setOriginalData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 게시글 정보 가져오기
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
      const boardData = {
        title: responseData.data.title,
        content: responseData.data.content,
      };
      setFormData(boardData);
      setOriginalData(boardData); // 원본 데이터 저장
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      setError("게시글을 불러오는데 실패했습니다.");
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
   * 입력값 변경 핸들러
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * 폼 제출 핸들러 (게시글 수정)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      window.alert("제목을 입력해주세요.");
      return;
    }

    // 변경 사항 확인
    if (formData.title === originalData.title && formData.content === originalData.content) {
      window.alert("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const responseData = await updateBoard(bid, formData);
      window.alert(responseData.message || "게시글이 수정되었습니다.");
      navigate(`/boards/${bid}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      window.alert("게시글 수정에 실패했습니다.")
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 취소 핸들러
   */
  const handleCancel = () => {
    // 변경 사항이 있는지 확인
    const hasChanges = 
      formData.title !== originalData.title || 
      formData.content !== originalData.content;

    if (hasChanges) {
      if (window.confirm("변경 사항이 저장되지 않습니다. 정말 취소하시겠습니까?")) {
        navigate(`/boards/${bid}`);
      }
    } else {
      navigate(`/boards/${bid}`);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className={styles.boardEditPage}>
        <div className={styles.container}>
          <h2 className={styles.title}>게시글 수정</h2>
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className={styles.boardEditPage}>
        <div className={styles.container}>
          <h2 className={styles.title}>게시글 수정</h2>
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button 
              className={styles.listButton}
              onClick={() => navigate("/boards")}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.boardEditPage}>
      <div className={styles.container}>
        <h2 className={styles.title}>게시글 수정</h2>
        
        <BoardForm
          formData={formData}
          isEdit={true}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default BoardEditPage;