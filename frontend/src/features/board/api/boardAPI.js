import apiClient from "../../../shared/api/axiosConfig";

const BOARD_BASE_PATH = "/api/boards";

/**
 * 게시글 등록 함수
 * @param {object} board - 새로 등록할 게시글 객체 {"title": "...", "content": "..."}
 * @returns 서버의 응답 데이터
 */
export const createBoard = async (board) => {
  try {
    const response = await apiClient.post(BOARD_BASE_PATH, board);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 게시글 수정 함수
 * @param {number} bid - 게시글 ID
 * @param {object} board - 수정할 게시글 객체 {"title": "...", "content": "..."}
 * @returns 서버의 응답 데이터
 */
export const updateBoard = async (bid, board) => {
  try {
    const response = await apiClient.put(`${BOARD_BASE_PATH}/${bid}`, board);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 게시글 삭제 함수
 * @param {number} bid - 게시글 ID
 * @returns 서버의 응답 데이터
 */
export const deleteBoard = async (bid) => {
  try {
    const response = await apiClient.delete(`${BOARD_BASE_PATH}/${bid}`);

    // DELETE 요청의 경우 204 No Content 응답이 올 수 있습니다. 응답이 오지 않는다는 의미입니다.
    if (response.status === 204) {
      return {
        status: 204,
        message: "게시글 삭제 성공",
      }
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 게시글 상세 조회 함수
 * @param {number} bid - 게시글 ID
 * @returns 서버의 응답 데이터
 */
export const getBoard = async (bid) => {
  try {
    const response = await apiClient.get(`${BOARD_BASE_PATH}/${bid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 게시글 목록 함수
 * @param {object} pageParams - 이동할 페이지 정보 객체 {page: 1, size: 5, sort: "createdAt,desc"}
 * @returns 서버의 응답 데이터
 */
export const getBoardList = async (pageParams) => {
  const { page = 1, size = 10, sort = "createdAt,desc" } = pageParams;

  try {
    const response = await apiClient.get(BOARD_BASE_PATH, {
      params: { page, size, sort }  // 쿼리 스트링으로 데이터 전송
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}