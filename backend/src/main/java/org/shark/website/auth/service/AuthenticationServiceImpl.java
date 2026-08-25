package org.shark.website.auth.service;

import org.shark.website.auth.dto.request.LoginRequestDTO;
import org.shark.website.auth.dto.request.RegisterRequestDTO;
import org.shark.website.auth.dto.response.JwtTokenResponseDTO;
import org.shark.website.auth.entity.User;
import org.shark.website.auth.enums.Role;
import org.shark.website.auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;  // 인증 매니저 (로그인 시 사용)
  
  // 회원가입
  @Override
  public JwtTokenResponseDTO register(RegisterRequestDTO request) {
    // 이메일 중복 체크
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException(request.getEmail() + "은(는) 이미 존재하는 이메일입니다.");
    }
    
    // 새 사용자 엔티티 생성
    User user = User.createUser(
          request.getEmail(),
          passwordEncoder.encode(request.getPassword()),  // 비밀번호 암호화
          request.getNickname()
        );
    user.updateRole(Role.USER);  // 생략 가능
    
    // 사용자 등록
    User savedUser = userRepository.save(user);
    
    // JWT 토큰 생성 (AccessToken, RefreshToken)
    String accessToken = jwtService.generateToken(savedUser);
    
    // 인증 응답 DTO 반환
    return JwtTokenResponseDTO.builder()
              .accessToken(accessToken)
              .refreshToken(null)
              .build();
  }

  // 로그인
  @Override
  public JwtTokenResponseDTO login(LoginRequestDTO request) {
    try {
      // Spring Security를 이용한 비밀번호 검증
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
      );
      // 인증 성공 시 사용자 정보 조회
      User foundUser = (User) authentication.getPrincipal();
      // accessToken 생성
      String accessToken = jwtService.generateToken(foundUser);
      // 인증 응답 DTO 반환
      return JwtTokenResponseDTO.builder()
          .accessToken(accessToken)
          .refreshToken(null)
          .build();
    } catch (BadCredentialsException e) {
      throw new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  }

}
