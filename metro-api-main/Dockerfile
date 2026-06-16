FROM gradle:jdk11 AS builder
WORKDIR /home/root/build/
COPY . .
RUN gradle build -x test

FROM openjdk:11-jre-slim
WORKDIR /home/root/your-awesome-app/
COPY --from=builder /home/root/build/build/libs/metro-api-0.0.1-SNAPSHOT.jar /home/root/your-awesome-app/
ENTRYPOINT ["java","-jar","metro-api-0.0.1-SNAPSHOT.jar"]