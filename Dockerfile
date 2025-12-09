# Multi-stage build for Spring Boot application
# Stage 1: Build
FROM gradle:8.5-jdk21-alpine AS build
WORKDIR /app

# Copy Gradle files
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle ./gradle

# Copy source code
COPY src ./src

# Build the WAR file
RUN ./gradlew bootWar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the WAR from build stage
COPY --from=build /app/build/libs/jobhunter.war jobhunter.war

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "jobhunter.war"]
