class CookieUtils {

  /**
   * 쿠키 설정
   * @param { string } name - 쿠키 이름
   * @param { string } value - 쿠키 값
   * @param { object } options - 쿠키 옵션 
   */
  static set( name, value, options = {} ) {
    //----- 쿠키 기본 문자열
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    //----- 쿠키 옵션 문자열
    // 1. expires 설정 (일 단위로 전달 받아 밀리초 단위로 설정)
    if (options.expires) {
      const date = new Date();
      date.setTime( date.getTime() + options.expires * 24 * 60 * 60 * 1000 );
      cookieString += `; expires=${date.toUTCString()}`;  // 쿠키 시간은 UTC 시간 사용이 필수 (브라우저는 UTC 시간을 받아서 사용자의 로컬 시간대로 자동 변환)
    }

    // 2. path 설정 (전달되지 않으면 "/" 사용)
    cookieString += `; path=${options.path || "/"}`;

    // 3. domain 설정
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    // 4. secure 설정 (false - 개발환경(http), true - 운영환경(https))
    if (options.secure) {
      cookieString += `; secure`;
    }

    // 5. sameSite 설정  (strict - 동일 사이트에서만 쿠키 전송, lax - 안전한 사이트 요청에는 쿠키 전송, none - 모든 요청에 쿠키 전송)
    if (options.sameSite) {
      cookieString += `; sameSite=${options.sameSite}`;
    }

    //----- 브라우저 쿠키 설정
    document.cookie = cookieString;
  }

  /**
   * 쿠키 가져오기
   * @param { string } name - 쿠키 이름
   * @returns { string | null } - 쿠키 값 또는 null
   */
  static get(name) {
    const encodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ")
        cookie = cookie.substring(1);
      if (cookie.indexOf(encodedName) === 0)
        return decodeURIComponent(cookie.substring(encodedName.length + 1));
    }
    return null;
  }

  /**
   * 쿠키 삭제하기
   * @param { string } name - 쿠키 이름
   * @param { object } options - 쿠키 옵션 (path, domain)
   */
  static remove(name, options = {}) {
    CookieUtils.set(name, "", {
      ...options,
      expires: -1,  // 과거 날짜를 전달하면 곧바로 삭제
    });
  }

  /**
   * 모든 쿠키 가져오기
   * @returns { object } - 모든 쿠키 객체
   */
  static getCookies() {
    let cookies = {};
    document.cookie.split(";").forEach( cookie => {
      const [ name, value ] = cookie.trim().split("=");
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    } )
    return cookies;
  }

}

export default CookieUtils;