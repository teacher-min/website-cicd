package org.shark.website.board.repository;

import java.util.List;

import org.shark.website.auth.entity.User;
import org.shark.website.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoardRepository extends JpaRepository<Board, Long> {

  // 특정 사용자가 작성한 게시글 목록 조회
  Page<Board> findByAuthor(User author, Pageable pageable);
  
  // 특정 사용자가 작성한 게시글 개수 조회
  long countByAuthor(User author);
  
  // 작성자 정보를 포함하여 게시글 조회 (FETCH JOIN으로 N+1 문제 해결)
  @Query("SELECT b FROM Board b JOIN FETCH b.author")
  List<Board> findAllWithAuthor();

  // 페이징과 함께 작성자 정보를 포함하여 게시글 조회 (FETCH JOIN으로 N+1 문제 해결)
  @Query("SELECT b FROM Board b JOIN FETCH b.author")
  Page<Board> findAllWithAuthor(Pageable pageable);
  
}
