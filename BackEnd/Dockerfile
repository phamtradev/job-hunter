# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy entire source code
COPY . .

# Give permission to gradlew
RUN chmod +x ./gradlew

# Build project without running tests
RUN ./gradlew clean build -x test

# Stage 2: Run the built JAR
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
