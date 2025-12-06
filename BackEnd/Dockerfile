FROM eclipse-temurin:21-jdk-alpine
EXPOSE 8080
ADD build/libs/spring-boot-docker.jar spring-boot-docker.jar
ENTRYPOINT ["java", "-jar", "spring-boot-docker.jar"]
