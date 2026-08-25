package org.shark.website.auth.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.shark.website.auth.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  //------ application.properties 등록한 JWT 정보 가져오기
  
  @Value("${jwt.secret-key}")
  private String secretKey;
  
  @Value("${jwt.expiration}")
  private long jwtExpiration;
  
  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;
  
  
  
  //----- JWT
  // 1. JSON 형식의 정보를 안전하게 전달하기 위한 표준 토큰입니다.
  // 2. 주로 인증/인가에서 사용하고, 위변조 방지를 위해서 디지털 서명을 포함합니다.
  // 3. JWT 토큰은 "Authorization" 헤더의 "Bearer" 스킴으로 전송합니다.
  
  //----- JWT 형식
  // 1. 형식
  //    Header.Payload.Signature (세 부분을 점(.)으로 연결한 문자열)
  // 2. 각 부분
  //    1) Header    : 토큰 유형(typ=JWT)과 서명 알고리즘(HS256 등)이 포함
  //    2) Payload   : 사용자와 토큰에 관한 클레임(Claims)이 JSON 형식으로 포함
  //    3) Signature : base64url(Header)와 base64url(Payload)을 알고리즘과 키로 서명한 값으로 위변조 검증에 사용
  
  //----- 클레임
  // 1. 토큰에 담는 정보를 의미합니다.
  // 2. key/value 형식의 JSON 데이터로 표현합니다.
  // 3. 등록된 클레임, 공개 클레임, 비공개 클레임으로 구분합니다.
  // 4. 예시
  //    { "iss": "토큰발급자", "sub": "토큰제목", "exp": "토큰만료시간" }
  
  
  
  /**
   * 서명키 생성 및 반환
   * 서명키는 JWT 토큰 생성 시 필요한 정보
   * 
   * @return application.properties에 등록한 jwt.secret-key를 이용해 생성한 SecretKey 객체를 반환
   */
  private SecretKey getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }
  
  
  /**
   * JWT 토큰 생성 및 반환
   * 
   * @param userDetails 사용자 정보(회원가입한사용자, 로그인한사용자)
   * @return JWT 토큰
   */
  public String generateToken(UserDetails userDetails) {
    // claims 맵 (JWT 토큰에 저장할 추가 정보 - email, nickname 추가)
    Map<String, Object> claims = new HashMap<>();
    
    // UserDetails는 username, password, authorities만 추출할 수 있으므로 User 엔티티 타입으로 다운캐스팅 필요
    if (userDetails instanceof User) {
      User user = (User) userDetails;
      claims.put("nickname", user.getNickname());
      claims.put("roles", user.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList()));
    }
    
    // 반환하는 JWT 구조
    // {
    //   "nickname": "유저",
    //   "roles": [ "USER" ],
    //   "sub": "user@example.com",
    //   "iat": 1699876543,
    //   "exp": 1699880143
    // }
    return Jwts.builder()
              .claims(claims)  // nickname, roles
              .subject(userDetails.getUsername())  // sub, 주체(사용자를 고유하게 식별하는 값. 일반적으로 이메일 사용)
              .issuedAt(Date.from(Instant.now()))  // iat, 발행일시(1699876543)
              .expiration(Date.from(Instant.now().plus(jwtExpiration, ChronoUnit.MILLIS)))  // exp, 만료일시(1699880143)
              .signWith(getSignInKey())  // 서명키
              .compact();
  }
  
  
  //----- JWT 토큰에서 클레임 추출
  // 1. JWT 토큰의 모든 클레임 추출
  private Claims extractAllClaims(String jwtToken) {
    return Jwts.parser()
              .verifyWith(getSignInKey())
              .build()
              .parseSignedClaims(jwtToken)
              .getPayload();
  }
  // 2. 특정 클레임만 추출
  public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
    return claimsResolver.apply(extractAllClaims(jwtToken));
  }
  // 3-1. JWT 토큰에서 사용자 이름 추출
  public String extractUsername(String jwtToken) {
    return extractClaim(jwtToken, Claims::getSubject);
  }
  // 3-2. JWT 토큰에서 만료시간 추출
  public Date extractExpiration(String jwtToken) {
    return extractClaim(jwtToken, Claims::getExpiration);
  }
  
  
  
  //----- JWT 토큰 유효성 검증
  public boolean isValidToken(String jwtToken, UserDetails userDetails) {
    try {
      // 사용자 일치 여부 + 만료시간 체크
      final String username = this.extractUsername(jwtToken);
      final Date expiration = this.extractExpiration(jwtToken);
      return (username.equals(userDetails.getUsername()) && expiration.after(Date.from(Instant.now())));
    } catch (Exception e) {
      return false;  // JWT 토큰에서 특정 클레임을 가져오기 실패
    }
  }
  
  public boolean isValidToken(String jwtToken) {
    try {
      // 만료시간 체크
      final Date expiration = this.extractExpiration(jwtToken);
      return expiration.after(Date.from(Instant.now()));
    } catch (Exception e) {
      return false;  // JWT 토큰에서 특정 클레임을 가져오기 실패
    }
  }
  
}
