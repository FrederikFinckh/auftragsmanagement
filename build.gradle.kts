plugins {
    java
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.auftrag"

// Version aus dem neuesten Git-Tag ableiten (z.B. v1.0.0 -> 1.0.0)
// Ohne Tag: 0.0.0-SNAPSHOT
// Mit Tag:  <tag>-SNAPSHOT wenn es Commits nach dem Tag gibt, sonst <tag>
val gitVersion: String by lazy {
    val process = ProcessBuilder("git", "tag", "--sort=-version:refname")
        .directory(rootDir)
        .redirectErrorStream(true)
        .start()
    val tags = process.inputStream.bufferedReader().readLines()
        .map { it.removePrefix("v") }
        .filter { it.matches(Regex("\\d+\\.\\d+\\.\\d+.*")) }
    process.waitFor()

    if (tags.isEmpty()) {
        "0.0.0-SNAPSHOT"
    } else {
        val latestTag = tags.first()
        val describeProcess = ProcessBuilder("git", "describe", "--tags", "--long")
            .directory(rootDir)
            .redirectErrorStream(true)
            .start()
        val describe = describeProcess.inputStream.bufferedReader().readText().trim()
        describeProcess.waitFor()

        val commitsSinceTag = if (describe.matches(Regex(".*-\\d+-[0-9a-f]+"))) {
            describe.split("-").takeLast(2).first().toInt()
        } else {
            0
        }

        if (commitsSinceTag == 0) latestTag else "$latestTag-SNAPSHOT"
    }
}
version = gitVersion

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

tasks.jar {
    enabled = false
}
