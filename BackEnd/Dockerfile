# Stage 1 - Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY . .

RUN chmod +x gradlew
RUN ./gradlew clean build -x test

# Stage 2 - Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy đúng file output mà bạn có!
COPY --from=build /app/build/libs/spring-boot-docker.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
