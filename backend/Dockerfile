# Multi-stage Dockerfile for Katasphere Spring Boot Backend
# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage with JDK, Python 3, and Node.js for code execution sandboxing
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Install Python 3 and Node.js so local execution engine supports all languages
RUN apk add --no-cache python3 nodejs

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/katasphere-backend.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java -Djava.security.egd=file:/dev/./urandom -Xmx384m -jar app.jar"]
