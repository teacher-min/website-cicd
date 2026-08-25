package org.shark.website.board.service;

import org.shark.website.auth.entity.User;
import org.shark.website.board.dto.BoardDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {
  Page<BoardDTO> getAllBoards(Pageable pageable);
  BoardDTO getBoardById(Long bid);
  BoardDTO createBoard(BoardDTO boardDTO, User author);
  BoardDTO updateBoard(Long bid, BoardDTO boardDTO, User currentUser);
  void deleteBoard(Long bid, User currentUser);
}
