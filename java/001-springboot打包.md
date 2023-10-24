# springboot项目打包

-----

* 调整pom.xml文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.16</version>
        <relativePath/>
    </parent>

    <groupId>com.github.jianlu8023.app</groupId>
    <artifactId>example</artifactId>
    <version>1.0.0.ALPHA</version>

    <name>example</name>

    <description>example</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.7.16</spring-boot.version>
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.test.skip>true</maven.test.skip>
        <maven-surefire-plugin.version>2.22.2</maven-surefire-plugin.version>
        <maven-compiler-plugin.version>3.8.1</maven-compiler-plugin.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!--配置私服-->
    <!--依赖加速-->
    <repositories>
        <!--jitpack源-->
        <repository>
            <id>jitpack.io</id>
            <url>https://jitpack.io</url>
        </repository>

        <repository>
            <id>aliyun-mirror</id>
            <name>aliyun-mirror</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
                <updatePolicy>never</updatePolicy>
                <checksumPolicy>warn</checksumPolicy>
            </releases>
            <snapshots>
                <enabled>false</enabled>
                <updatePolicy>always</updatePolicy>
                <checksumPolicy>warn</checksumPolicy>
            </snapshots>
        </repository>
    </repositories>

    <!--插件加速-->
    <pluginRepositories>
        <pluginRepository>
            <id>aliyun-plugin</id>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
                <updatePolicy>never</updatePolicy>
                <checksumPolicy>warn</checksumPolicy>
            </releases>
            <snapshots>
                <enabled>false</enabled>
                <updatePolicy>always</updatePolicy>
                <checksumPolicy>warn</checksumPolicy>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>

    <!--打包上传，配置私服-->
    <!--编译部署-->
    <distributionManagement>
        <repository>
            <id>id</id>
            <name>name</name>
            <url>url</url>
        </repository>
        <snapshotRepository>
            <id>id</id>
            <name>name</name>
            <url>url</url>
        </snapshotRepository>
    </distributionManagement>


    <build>
        <finalName>example-1.0.0.ALPHA</finalName>
        <plugins>

            <!--执行main方法-->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.0.0</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>java</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <classpathScope>test</classpathScope>
                </configuration>
            </plugin>

            <!--定义项目的编译环境-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>

            <!--添加配置跳过测试-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${maven-surefire-plugin.version}</version>
                <configuration>
                    <skipTests>true</skipTests>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
                <configuration>
                    <!-- 热部署生效 -->
                    <fork>false</fork>
                    <mainClass>com.github.jianlu8023.app.ExampleApplication</mainClass>
                    <skip>true</skip>
                    <!--添加资源-->
                    <addResources>true</addResources>
                    <outputDirectory>${project.build.directory}/jar</outputDirectory>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!-- 打JAR包 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>2.4</version>
                <configuration>
                    <!-- 不打包资源文件（配置文件和依赖包分开） -->
                    <excludes>
                        <exclude>*.yaml</exclude>
                        <exclude>*.xml</exclude>
                        <exclude>*.txt</exclude>
                    </excludes>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <!-- MANIFEST.MF 中 Class-Path 加入前缀 -->
                            <classpathPrefix>lib/</classpathPrefix>
                            <!-- jar包不包含唯一版本标识 -->
                            <useUniqueVersions>false</useUniqueVersions>
                            <!--指定入口类 -->
                            <mainClass>com.github.jianlu8023.app.ExampleApplication</mainClass>
                        </manifest>
                        <manifestEntries>
                            <!--MANIFEST.MF 中 Class-Path 加入资源文件目录 -->
                            <Class-Path>./config/</Class-Path>
                        </manifestEntries>
                    </archive>
                    <outputDirectory>${project.build.directory}</outputDirectory>
                </configuration>
            </plugin>
            <!-- 该插件的作用是用于复制依赖的jar包到指定的文件夹里 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>2.8</version>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>${project.build.directory}/lib/</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <!-- 该插件的作用是用于复制指定的文件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>3.1.0</version>
                <executions>
                    <execution> <!-- 复制配置文件 -->
                        <id>copy-resources</id>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-resources</goal>
                        </goals>
                        <configuration>
                            <resources>
                                <resource>
                                    <directory>src/main/resources</directory>
                                    <includes>
                                        <exclude>*.yaml</exclude>
                                        <exclude>*.xml</exclude>
                                        <exclude>*.txt</exclude>
                                        <include>*.json</include>
                                    </includes>
                                </resource>
                            </resources>
                            <outputDirectory>${project.build.directory}/config</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

* 编写Dockerfile文件

```dockerfile
FROM openjdk:8-jre

# env
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

WORKDIR /app

# sed 命令 /可替换 @ $ # 仅是区分四个区域
RUN sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

ADD ./target/example-1.0.0.ALPHA.jar .
COPY ./target/config /app/config
COPY ./target/lib /app/lib
#COPY ./target/db /app/db
#COPY ./target/network /app/network
#COPY ./target/logs /app/logs
CMD ["java","-jar","example-1.0.0.ALPHA.jar"]
EXPOSE 9001

```

* 执行build命令

```shell
# 清空build缓存
docker builder prune -a
# build
docker buildx build -t app-example:v1.0.0 -f Dockerfile .
```

* 编写docker-compose文件

```yaml
version: '3.9'
services:
  travel:
    image: app-example:v1.0.0
    volumes:
      - ./target/config:/app/config
      - ./target/lib:/app/lib
      - ./target/logs:/app/logs
    ports:
      - 9001:9001
    network_mode: "host"
```