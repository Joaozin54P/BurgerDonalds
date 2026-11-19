# ---------- Estágio 1: compilar com GraalVM ----------
FROM ghcr.io/graalvm/jdk-community:21 AS build
WORKDIR /build

ADD https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz /tmp/maven.tar.gz
RUN microdnf install -y tar gzip && \
    mkdir -p /opt/maven && \
    tar -xzf /tmp/maven.tar.gz -C /opt/maven --strip-components=1 && \
    rm /tmp/maven.tar.gz
ENV PATH="/opt/maven/bin:${PATH}"

COPY . .
RUN mvn -B -q -Dmaven.test.skip=true package

# ---------- Estágio 2: runtime GraalVM ----------
FROM ghcr.io/graalvm/jdk-community:21
WORKDIR /app
COPY --from=build /build/spring/target/*.jar app.jar

# O Render injeta a porta na variável PORT (o application.yaml já lê)
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=65", "-XX:+UseSerialGC", "-jar", "app.jar"]