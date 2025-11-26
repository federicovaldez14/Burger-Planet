# ============================
# 1) Etapa de construcción
# ============================
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar el código
COPY pom.xml .
COPY src ./src

# Compilar el proyecto y generar el JAR
RUN mvn clean package -DskipTests

# ============================
# 2) Etapa de ejecución
# ============================
FROM eclipse-temurin:17-jdk

# Directorio donde correrá el backend
WORKDIR /app

# Copiar el jar desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Usar el puerto dinámico asignado por Render
ENV PORT=8080

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar el backend
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
