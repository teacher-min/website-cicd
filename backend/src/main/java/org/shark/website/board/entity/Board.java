package org.shark.website.board.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.DynamicUpdate;
import org.shark.website.auth.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "boards")
@DynamicUpdate
@Getter
@Setter  // 양방향 연관관계 편의 메소드에서 사용
@EntityListeners(AuditingEntityListener.class)  // Spring Data JPA의 Auditing 기능 활성화
public class Board {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long bid;
  
  @Column(nullable = false, length = 200)
  private String title;
  
  @Column(columnDefinition = "TEXT")
  private String content;
  
  @CreatedDate
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
  
  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
  
  // Board 엔티티가 연관관계의 주인
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "uid")  // 외래키 칼럼명: uid
  private User author;

  protected Board() { }
  
  private Board(String title, String content) {
    this.title = title;
    this.content = content;
  }
  
  // 정적 팩토리 메소드1: 작성자 정보 포함
  public static Board createBoard(String title, String content) {
    return new Board(title, content);
  }
  
  // 정적 팩토리 메소드2: 작성자 정보 미포함
  public static Board createBoard(String title, String content, User author) {
    Board board = new Board(title, content);
    board.author = author;
    return board;
  }
  
  public void updateBoard(String title, String content) {
    this.title = title;
    this.content = content;
  }
  
  // 작성자 변경
  public void changeAuthor(User newAuthor) {
    // 기존 작성자와의 연관관계 해제
    if (this.author != null) {
      this.author.getBoards().remove(this);
    }
    // 새 작성자와의 연관관계 설정
    this.author = newAuthor;
    if (newAuthor != null) {
      newAuthor.getBoards().add(this);
    }
  }
  
  @Override
  public String toString() {
  return "Board [bid=" + bid + ", title=" + title + ", content=" + content + ", author=" + (author != null ? author.getNickname() : "null") + ", createdAt=" + createdAt
      + ", updatedAt=" + updatedAt + "]";
  }
  
}
