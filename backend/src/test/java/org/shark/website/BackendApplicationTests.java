package org.shark.website;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class BackendApplicationTests {

  // JWT 토큰 생성을 위해서는 서명키가 필요합니다.
  // 서명키(SecretKey) 생성을 위해서는 Base64 인코딩 방식의 비밀키(문자열)가 필요합니다.
  
  // Base64 인코딩된 비밀키 만들기
  @Test
  void generateBase64EncodedKey() {
    java.security.Key key = io.jsonwebtoken.Jwts.SIG.HS256.key().build();
    String encodedKey = java.util.Base64.getEncoder().encodeToString(key.getEncoded());
    log.info("Base64 Encoded Key:{}", encodedKey);
  }

}
