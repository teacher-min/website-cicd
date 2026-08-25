package org.shark.website.auth.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.shark.website.auth.enums.Role;
import org.shark.website.board.entity.Board;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "users")
@Getter
@EntityListeners(AuditingEntityListener.class)  // Spring Data JPA의 Auditing 기능 활성화
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long uid;
  
  @Column(nullable = false, unique = true)
  private String email;
  
  @Column(nullable = false)
  private String password;
  
  @Column(nullable = false)
  private String nickname;
  
  @Enumerated(EnumType.STRING)
  private Role role;
  
  @CreatedDate
  @Column(name = "created_at")
  private LocalDateTime createdAt;
  
  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
  
  // User 엔티티는 연관관계의 주인이 아닌 쪽
  // mappedBy = "author": Board.author 필드가 연관관계임
  @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
  private List<Board> boards = new ArrayList<>();  // NPE 방지를 위해 new ArrayList<>();
  
  protected User() { }
  
  public static User createUser(String email, String password, String nickname) {
    User user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.role = Role.USER;  // 기본 Role은 USER
    return user;
  }
  
  public void updateRole(Role role) {
    this.role = role;
  }
  
  // 양방향 연관관계 편의 메소드: 게시글 추가
  public void addBoard(Board board) {
    this.boards.add(board);
    board.setAuthor(this);  // Board의 작성자를 현재 User로 설정
  }
  
  // 양방향 연관관계 편의 메소드: 게시글 삭제
  public void removeBoard(Board board) {
    this.boards.remove(board);
    board.setAuthor(null);  // Board의 작성자를 null로 설정
  }
  
  //----- UserDetails 인터페이스 구현 (오버라이드)
  
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(role.name()));
  }
  
  @Override
  public String getPassword() {
    return password;
  }
  
  @Override
  public String getUsername() {
    return email;  // 이메일을 username으로 사용
  }
  
  @Override
  public boolean isAccountNonExpired() {
    return true;  // 계정 만료 여부 반환 (모든 사용자는 계정이 만료되지 않았음)
  }
  
  @Override
  public boolean isAccountNonLocked() {
    return true;  // 계정 잠금 여부 반환 (모든 사용자는 잠기지 않았음)
  }
  
  @Override
  public boolean isCredentialsNonExpired() {
    return true;  // 비밀번호 만료 여부 반환 (모든 사용자의 비밀번호는 만료되지 않았음)
  }
  
  @Override
  public boolean isEnabled() {
    return true;  // 계정 활성화 여부 반환 (모든 사용자는 활성화 되어 있음)
  }
  
}
