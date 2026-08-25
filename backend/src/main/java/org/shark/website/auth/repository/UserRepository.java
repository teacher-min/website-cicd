package org.shark.website.auth.repository;

import java.util.Optional;

import org.shark.website.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  // 이메일로 사용자 조회 (로그인 시 필요)
  Optional<User> findByEmail(String email);
  
  // 이메일 존재 여부 반환 (회원가입 시 중복 체크)
  boolean existsByEmail(String email);
  
}
