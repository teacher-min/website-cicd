/**
 * JWT 토큰 유틸리티
 * Base64로 인코딩된 JWT를 디코딩하여 사용자 정보 추출
 */
class JwtUtils {

  /**
   * JWT 토큰 디코딩 (페이로드 추출)
   * @param {string} token - JWT 토큰
   * @returns {object|null} - 디코딩된 페이로드 객체
   */
  static decode(token) {
    try {
      if (!token) {
        return null;
      }
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("잘못된 형식의 JWT 토큰입니다.");
        return null;
      }
      // 페이로드를 Base64 URL-safe 디코딩
      const payload = parts[1];  // 헤더.페이로드.서명
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.log("JWT 토큰 디코딩 오류:", error);
      return null;
    }
  }

  /**
   * JWT 토큰에서 사용자 정보 추출 후 반환
   * @param {string} token - JWT 토큰
   * @returns {object|null} - 사용자 정보 객체
   */
  static getUserInfo(token) {
    const payload = this.decode(token);
    if (!payload) {
      return null;
    }
    // 부트에서 보낸 JWT 토큰 형식
    return {
      email: payload.sub,  // subject (email)
      nickname: payload.nickname,  // nickname
      roles: payload.roles,  // roles
      iat: payload.iat,  // issuedAt
      exp: payload.exp,  // expiration
    }
  }

  /**
   * JWT 토큰 만료 여부 확인
   * @param {string} token - JWT 토큰
   * @returns {boolean} 만료 여부
   */
  static isTokenExpired(token) {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return null;
    }
    // exp는 초 단위의 타임스탬프
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return payload.exp < currentTimestamp;
  }

  /**
   * JWT 토큰의 남은 유효 시간 (초)
   * @param {string} token - JWT 토큰
   * @returns {number} - 만료까지 남은 시간(초), 만료되면 0
   */
  static getTimeUntilExpiration(token) {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return 0;  // null 아니고 0
    }
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeRemaining = payload.exp - currentTimestamp;

    return Math.min(0, timeRemaining);
  }

  /**
   * JWT 토큰이 곧 만료되는지 확인
   * @param {string} token - JWT 토큰
   * @param {number} threshold - 임계값 (초 단위, 기본 5분)
   * @returns {boolean} 5분 이내 만료되는지 여부
   */
  static isTokenExpiringSoon(token, threshold = 300) {
    return this.getTimeUntilExpiration() < threshold;
  }

}

export default JwtUtils;