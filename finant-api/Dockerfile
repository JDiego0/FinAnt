# Etapa 1 — Build con Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2 — Runtime ligero
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/finant-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Dserver.port=${PORT:-10000}", "-jar", "app.jar"]