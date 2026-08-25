package org.shark.website.auth.controller;

import org.shark.website.auth.dto.request.LoginRequestDTO;
import org.shark.website.auth.dto.request.RegisterRequestDTO;
import org.shark.website.auth.dto.response.JwtTokenResponseDTO;
import org.shark.website.auth.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService authenticationService;
  
  // 회원가입
  @PostMapping("/register")
  public ResponseEntity<JwtTokenResponseDTO> register(
      @RequestBody RegisterRequestDTO request
  ) {
    return ResponseEntity.ok(authenticationService.register(request));
  }
  
  // 로그인
  @PostMapping("/login")
  public ResponseEntity<JwtTokenResponseDTO> login(
      @RequestBody LoginRequestDTO request
  ) {
    return ResponseEntity.ok(authenticationService.login(request));
  }
  
  // 로그아웃 (클라이언트에 저장된 토큰 삭제)
  @PostMapping("/logout")
  public ResponseEntity<String> logout() {
    // JWT 방식 : stateless 방식(서버에서 처리할 별도 로그아웃 로직이 없음)
    return ResponseEntity.ok("로그아웃 되었습니다. 클라이언트에서 토큰을 삭제해주세요.");
  }
  
}