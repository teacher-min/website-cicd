import { useState, useEffect, useCallback } from "react";
import useBoardNavigate from "../hooks/useBoardNavigate";
import { getBoardList } from "../api/boardAPI";
import BoardList from "../components/BoardList/BoardList";
import styles from "./BoardListPage.module.css";

// 초기 state 
const INITIAL_SERVER_DATA = {
  status: 0,
  message: "",
  data: {
    content: [],    // 게시글 목록
    page: {         // 페이징 정보
      size: 0,           // 한 페이지에 표시할 게시글 수
      number: 0,         // 현재 페이지 번호
      totalElements: 0,  // 전체 게시글 수
      totalPages: 0,     // 전체 페이지 수
    },
  }
}

/**
 * 게시판 목록 페이지
 */
const BoardListPage = () => {
  const { currentPageParams, goToDetailPage, goToCreatePage, goToListPage } = useBoardNavigate();
  const { page, size, sort } = currentPageParams;

  const [ serverData, setServerData ] = useState(INITIAL_SERVER_DATA);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  /**
   * 서버에서 게시글 목록 가져오기
   */
  const fetchBoardList = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const responseData = await getBoardList( { page, size, sort } );
      setServerData(responseData);
    } catch (error) {
      console.error("게시글 목록 로드 실패:", error);
      setError(error.message || "게시글을 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [page, size, sort]);

  /**
   * 페이지 로드 시 or 페이질 파라미터 변경 시 데이터 로드
   */
  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);

  /**
   * 제목 클릭 핸들러
   * @param {number} bid - 게시글 ID
   */
  const handleTitleClick = (bid) => {
    goToDetailPage(bid);
  }

  /**
   * 글쓰기 버튼 클릭 핸들러
   */
  const handleCreateClick = () => {
    goToCreatePage();
  }

  /**
   * 페이지 변경 핸들러
   * @param {number} newPage - 이동할 페이지 번호
   */
  const handlePageChange = (newPage) => {
    goToListPage(newPage);
  }

  return (
    <div className={styles.boardListPage}>
      <div className={styles.container}>
        <h2 className={styles.title}>게시판</h2>
        
        <BoardList
          serverData={serverData}
          currentPageParams={currentPageParams}
          isLoading={isLoading}
          error={error}
          onTitleClick={handleTitleClick}
          onCreateClick={handleCreateClick}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BoardListPage;