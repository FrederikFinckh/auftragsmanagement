plugins {
    java
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.auftrag"
version = "1.0.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.xerial:sqlite-jdbc:3.47.1.0")
    implementation("org.hibernate.orm:hibernate-community-dialects:6.6.4.Final")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

// ── Frontend build task ──────────────────────────────────────────────

val frontendDir = file("frontend")
val frontendBuildDir = file("frontend/dist")
val staticDir = file("src/main/resources/static")

tasks.register<Exec>("pnpmInstall") {
    workingDir = frontendDir
    commandLine("pnpm", "install")
    inputs.file("frontend/package.json")
    outputs.dir("frontend/node_modules")
}

tasks.register<Exec>("buildFrontend") {
    dependsOn("pnpmInstall")
    workingDir = frontendDir
    commandLine("pnpm", "run", "build")
    inputs.dir("frontend/src")
    inputs.file("frontend/index.html")
    inputs.file("frontend/vite.config.ts")
    inputs.file("frontend/tsconfig.json")
    outputs.dir(frontendBuildDir)
}

tasks.register<Copy>("copyFrontend") {
    dependsOn("buildFrontend")
    from(frontendBuildDir)
    into(staticDir)
}

tasks.named("processResources") {
    dependsOn("copyFrontend")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
