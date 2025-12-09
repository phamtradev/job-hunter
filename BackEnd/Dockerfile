# Stage 1: Build the Spring Boot WAR
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Gradle wrapper and build files first (better layer caching)
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle

# Copy source code
COPY src ./src

# Make wrapper executable and build WAR (skip tests for faster CI)
RUN chmod +x gradlew && ./gradlew bootWar -x test --no-daemon

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built WAR (name is set in build.gradle.kts as jobhunter.war)
COPY --from=build /app/build/libs/jobhunter.war app.war

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.war"]
