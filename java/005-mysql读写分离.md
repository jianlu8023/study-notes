# Mysql 读写分离


## 步骤

### mysql配置


### springboot配置

* pom.xml文件添加依赖

```xml
<dependencies>
	<dependency>
		<groupId>com.alibaba</groupId>
		<artifactId>druid-spring-boot-starter</artifactId>
		<version>1.2.11</version>
	</dependency>
	<dependency>
  		<groupId>com.baomidou</groupId>
  		<artifactId>dynamic-datasource-spring-boot-starter</artifactId>
  		<version>3.3.1</version>
  		<!--<version>4.2.0</version>-->
	</dependency>
	<dependency>
		<groupId>com.baomidou</groupId>
  		<artifactId>mybatis-plus-boot-starter</artifactId>
 		<version>3.5.3.2</version>
	</dependency>
	<dependency>
		<groupId>com.mysql</groupId>
		<artifactId>mysql-connector-j</artifactId>
		<version>8.0.33</version>
	</dependency>
</dependencies>
```


* application.yaml文件

```yaml

spring:
  autoconfigure:
    exclude: com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure
  servlet:
    multipart:
      maxFileSize: 1024MB
      maxRequestSize: 1024MB
  datasource:
    dynamic:
      # default datasource
      primary: master
      datasource:
        master:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://192.168.58.131:3306/ipfsbrowser?clobAsString=1&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=GMT%2B8&allowPublicKeyRetrieval=true
          username: root
          password: 123456
        slave:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://192.168.58.131:3306/ipfsbrowser?clobAsString=1&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=GMT%2B8&allowPublicKeyRetrieval=true
          username: root
          password: 123456
      druid:
        initial-size: 10
        max-active: 20
        min-idle: 10
        max-wait: 60000
        test-on-borrow: true
        test-while-idle: true
mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
logging:
  config: classpath:logback.xml

```



