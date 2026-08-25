package org.shark.website.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@Configuration
@EnableJpaAuditing  // Spring Data JPA의 Auditing 기능 활성화 (@CreatedDate, @LastModifiedDate 동작)
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)  // 모든 Page<T> 객체를 자동으로 PageModel<T>로 래핑 (스프링 부트 3.3 이상의 경우 설정 권장)
public class JpaConfig {

}
