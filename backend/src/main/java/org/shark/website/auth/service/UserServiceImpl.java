package org.shark.website.auth.service;

import org.shark.website.auth.entity.User;
import org.shark.website.auth.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  
  @Override
  public User findByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));
  }

  // 현재 JWT로 인증된 사용자 정보 조회 (로그인 유저 정보 조회)
  @Override
  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new IllegalStateException("인증된 사용자가 없습니다");
    }
    String email = authentication.getName();  // JWT에서 추출된 이메일
    return findByEmail(email);
  }

}
