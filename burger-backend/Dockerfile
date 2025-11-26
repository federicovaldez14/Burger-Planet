# ============================
# 1) Etapa de construcción
# ============================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# ============================
# 2) Etapa final
# ============================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copiamos el jar final
COPY --from=build /app/target/*.jar app.jar

# Render nos da una variable PORT
ENV PORT=8080

EXPOSE 8080

# Ejecutamos el backend
CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
