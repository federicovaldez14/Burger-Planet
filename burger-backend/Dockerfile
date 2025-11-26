# ============ BUILDER STAGE ============
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ============ RUNTIME STAGE ============
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Render usa variable PORT
ENV PORT=8080

EXPOSE 8080

# Ejecutar el jar correcto
CMD ["java", "-jar", "app.jar", "--server.port=${PORT}"]
