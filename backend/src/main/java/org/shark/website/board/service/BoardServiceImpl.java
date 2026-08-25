package org.shark.website.board.service;

import org.shark.website.auth.entity.User;
import org.shark.website.board.dto.BoardDTO;
import org.shark.website.board.entity.Board;
import org.shark.website.board.repository.BoardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BoardServiceImpl implements BoardService {

  private final BoardRepository boardRepository;
  
  @Transactional(readOnly = true)
  @Override
  public Page<BoardDTO> getAllBoards(Pageable pageable) {
    pageable = pageable.withPage(pageable.getPageNumber() - 1);
    log.info("페이지: {}, 크기: {}", pageable.getPageNumber(), pageable.getPageSize());
    Page<Board> boardPage = boardRepository.findAll(pageable);
    return boardPage.map(BoardDTO::toDTO);
  }

  @Transactional(readOnly = true)
  @Override
  public BoardDTO getBoardById(Long bid) {
    Board board = boardRepository.findById(bid)
        .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. bid: " + bid));
    return BoardDTO.toDTO(board);
  }

  @Override
  public BoardDTO createBoard(BoardDTO boardDTO, User author) {
    // 작성자 정보를 포함한 Board 엔티티 생성
    Board board = boardDTO.toEntity(author);
    Board saved = boardRepository.save(board);
    log.info("게시글 생성 완료: {}, 작성자: {}", saved, author.getNickname());
    return BoardDTO.toDTO(saved);
  }

  @Override
  public BoardDTO updateBoard(Long bid, BoardDTO boardDTO, User currentUser) {
    Board foundBoard = boardRepository.findById(bid)
        .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. bid: " + bid));
    // 작성자 본인만 수정 가능
    if (foundBoard.getAuthor().getUid() != currentUser.getUid()) {
      throw new IllegalArgumentException("게시글 수정 권한이 없습니다. 작성자만 수정할 수 있습니다.");
    }
    foundBoard.updateBoard(boardDTO.getTitle(), boardDTO.getContent());
    log.info("게시글 수정 완료 - bid: {}, 수정자: {}", bid, currentUser.getNickname());
    return BoardDTO.toDTO(foundBoard);
  }

  @Override
  public void deleteBoard(Long bid, User currentUser) {
    Board foundBoard = boardRepository.findById(bid)
        .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. bid: " + bid));
    // 작성자 본인만 삭제 가능
    if (foundBoard.getAuthor().getUid() != currentUser.getUid()) {
      throw new IllegalArgumentException("게시글 삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.");
    }
    boardRepository.delete(foundBoard);
    log.info("게시글 삭제 완료 - bid: {}, 삭제자: {}", bid, currentUser.getNickname());
  }

}
