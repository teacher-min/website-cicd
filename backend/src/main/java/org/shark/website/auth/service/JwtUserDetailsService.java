package org.shark.website.auth.service;

import org.shark.website.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

// UserDetails 정보를 얻기 위한 UserDetailsService 구현체

@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;
  
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // findByEmail() 메소드의 반환 타입은 User 엔티티인데, User 엔티티는 UserDetails 인터페이스의 구현체입니다.
    return userRepository.findByEmail(username)
              .orElseThrow(() -> new UsernameNotFoundException(username + " 사용자를 찾을 수 없습니다."));
  }
  
}
