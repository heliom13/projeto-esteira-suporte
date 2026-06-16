FROM gradle:jdk17 AS builder
WORKDIR /home/root/build/
COPY . .
RUN gradle build -x test

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app/
COPY --from=builder /home/root/build/build/libs/metro-api-0.0.1-SNAPSHOT.jar /app/metro-api.jar
ENTRYPOINT ["java", "-jar", "metro-api.jar"]
