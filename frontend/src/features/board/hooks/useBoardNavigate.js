import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

/**
 * 게시판 네비게이션 커스텀 훅
 */
const useBoardNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ searchParams ] = useSearchParams();

  // 페이징 처리를 위한 파라미터 (URL 쿼리 스트링에서 페이지 정보 추출)
  const currentPageParams = {
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 5,
    sort: searchParams.get("sort") || "createdAt,desc",
  }

  /**
   * 목록 페이지로 이동
   * @param {object} pageParams - 페이징 객체: {page: 1, size: 5, sort: "createdAt,desc"}
   */
  const goToListPage = (pageParams) => {
    const queryString = new URLSearchParams(pageParams).toString();
    navigate(`/boards?${queryString}`);
  }

  /**
   * 등록 페이지로 이동
   */
  const goToCreatePage = () => {
    navigate("/boards/create");
  }

  /**
   * 수정 페이지로 이동
   * @param {number} bid - 게시글 ID
   */
  const goToUpdatePage = (bid) => {
    navigate(`/boards/${bid}/edit`);
  }

  /**
   * 상세 페이지로 이동
   * - 현재 페이지 정보를 state로 전달
   * @param {number} bid - 게시글 ID
   */
  const goToDetailPage = (bid) => {
    navigate(`/boards/${bid}`, {
      state: {
        from: location.pathname + location.search,  // 현재 경로
        pageParams: currentPageParams,  // 페이징 정보
      }
    });
  }

  /**
   * 이전 페이지로 이동
   * - state에 저장된 경로가 있으면 그 경로로 이동, 없으면 목록 1페이지로 이동
   */
  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state?.from);  // 이전 페이지 정보가 있으면 그대로 이동
    } else {
      goToListPage(1);  // 이전 페이지 정보가 없으면 1페이지로 이동
    }
  }

  return {
    // 페이징 파라미터
    currentPageParams,
    // 네비게이션 함수
    goToCreatePage,
    goToUpdatePage,
    goToDetailPage,
    goToListPage,
    goBack,
  }
}

export default useBoardNavigate;