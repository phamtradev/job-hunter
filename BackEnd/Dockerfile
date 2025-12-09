# Stage 1 - Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY . .

# Build only the WAR (bootWar). Tests skipped for faster image build.
RUN chmod +x gradlew
RUN ./gradlew bootWar -x test --no-daemon

# Stage 2 - Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built WAR
COPY --from=build /app/build/libs/jobhunter.war app.war

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.war"]
