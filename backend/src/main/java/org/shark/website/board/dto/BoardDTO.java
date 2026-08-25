package org.shark.website.board.dto;

import java.time.LocalDateTime;

import org.shark.website.auth.entity.User;
import org.shark.website.board.entity.Board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BoardDTO {
  
  // 게시글 정보
  private Long bid;
  private String title;
  private String content;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  
  // 작성자 정보
  private AuthorDTO author;
  
  // 내부 클래스 AuthorDTO
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  @ToString
  public static class AuthorDTO {
    private Long uid;
    private String email;
    private String nickname;
  }
  
  // 작성자 정보 없는 toEntity 메소드
  public Board toEntity() {
    return Board.createBoard(title, content);
  }
  
  // 작성자 정보 있는 toEntity 메소드
  public Board toEntity(User author) {
    return Board.createBoard(title, content, author);
  }
  
  // toDTO 메소드
  public static BoardDTO toDTO(Board board) {
    if (board == null) {
      return null;
    }
    // 작성자 정보를 AuthorDTO로 반환
    AuthorDTO authorDTO = null;
    if (board.getAuthor() != null) {
      authorDTO = AuthorDTO.builder()
          .uid(board.getAuthor().getUid())
          .email(board.getAuthor().getEmail())
          .nickname(board.getAuthor().getNickname())
          .build();
    }
    return BoardDTO.builder()
        .bid(board.getBid())
        .title(board.getTitle())
        .content(board.getContent())
        .createdAt(board.getCreatedAt())
        .updatedAt(board.getUpdatedAt())
        .author(authorDTO)
      .build();
  }
  
}
