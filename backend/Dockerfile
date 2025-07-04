FROM eclipse-temurin:21-jdk-alpine


WORKDIR /app

# Copy the Spring Boot jar into the container
COPY target/filehub*.jar filehub.jar

# Run the app
ENTRYPOINT ["java", "-jar", "filehub.jar"]