# ===== STAGE 1: Spring Boot 빌드 스테이지 =====
FROM gradle:8.5-jdk21 AS builder
WORKDIR /website

# Gradle 캐시 활용을 위한 설정 파일 우선 복사
COPY build.gradle settings.gradle /website/
COPY gradle /website/gradle
COPY gradlew /website/

# gradlew 실행 권한 부여
RUN chmod +x ./gradlew

# 소스 코드 복사 및 실행 가능한 Jar 빌드 (테스트 제외)
# gradle 대신 gradlew 사용으로 Spring Boot에 명시된 Gradle 버전으로 빌드 (버전 호환 문제 해결)
COPY src /website/src
RUN ./gradlew clean bootJar -x test --no-daemon

# ===== STAGE 2: 실행 스테이지 =====
FROM eclipse-temurin:21-jre
WORKDIR /website

# STAGE 1 빌드 산출물(Jar)만 경량 실행 환경으로 복사
COPY --from=builder /website/build/libs/*.jar website.jar

EXPOSE 8080

# 컨테이너 실행 명령
CMD ["java", "-jar", "website.jar"]