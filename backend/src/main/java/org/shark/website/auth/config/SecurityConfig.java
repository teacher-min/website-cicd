package org.shark.website.auth.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.shark.website.auth.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final UserDetailsService userDetailsService;

  // 아래 방법 중 한 가지 방법으로 환경 변수를 주입 받을 수 있습니다.
  // @Value("${ALLOWED_ORIGIN}")    // docker-compose.yml 파일에서 환경 변수를 받아옵니다. (직접 받기)
  @Value("${cors.allowed-origin}")  // application.properties 파일에서 환경 변수를 받아옵니다. (경유해서 받기)
  private String allowedOrigin;

  // 비밀번호 암호화
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
 
  // 인증 관리자
  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
  
  // 인증 제공자 (없으면 자동 생성됨, 명시적 등록 권장)
  @Bean
  AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }
  
  // CORS 설정 (빈 아님)
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // React App 허용
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigin));  // EC2 Public IP 값이 사용됩니다.
    // HTTP 메소드 허용
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    // 모든 헤더 허용
    configuration.setAllowedHeaders(Arrays.asList("*"));
    // 인증 정보 허용 (JWT 토큰)
    configuration.setAllowCredentials(true); // ← 쿠키 허용
    // 모든 경로에 configuration 적용
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    // 반환
    return source;
  }
  
  // 시큐리티 필터 체인 커스텀
  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    
    http
    
      // CSRF 비활성화
      .csrf(configurer -> configurer.disable())
      
      // 요청(주소)별 인증 설정
      .authorizeHttpRequests(auth -> auth
          // 인증 관련 엔드 포인트는 모든 사용자에게 허용
          .requestMatchers("/api/auth/**").permitAll()
          // 나머지 모든 요청은 인증 필요
          .anyRequest().authenticated()
      )
      
      // 세션 설정 (JWT 사용 시 STATELESS로 설정: 세션 사용 안 함)
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      
      // 인증 제공자 등록
      .authenticationProvider(authenticationProvider())
      
      // 인증 관리자는 필터 체인에 의해 자동 사용되는 것이 아니라 직접 사용하기 위한 것이므로 등록 필요 없음
    
      // CORS 설정
      .cors(configurer -> configurer.configurationSource(corsConfigurationSource()))
      
      // JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 배치
      // UsernamePasswordAuthenticationFilter는 폼 로그인 시(POST /login) 사용하는 필터
      // JwtAuthenticationFilter가 먼저 동작하고 인증에 성공하면 UsernamePasswordAuthenticationFilter가 실행되지 않습니다.
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
      
    return http.build();
    
  }

}
