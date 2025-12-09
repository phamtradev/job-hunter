# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
COPY src ./src

# Build JAR
RUN chmod +x gradlew && ./gradlew bootJar -x test && cp build/libs/*.jar app.jar


# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create upload folder
RUN mkdir -p /app/upload
VOLUME /app/upload

# Copy built jar
COPY --from=build /app/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
