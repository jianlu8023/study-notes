# SpringBoot 项目application.yaml + logback.xml文件配置

## application.yaml

```yaml
server:
  # 应用服务 WEB 访问端口
  port: 8080
  servlet:
    context-path: /demo

spring:
  profiles:
    active: dev
  servlet:
    multipart:
      max-request-size: 1024MB
      max-file-size: 1024MB
  # THYMELEAF (ThymeleafAutoConfiguration)
  thymeleaf:
    # 在构建 URL 时添加到视图名称后的后缀（默认值： .html ）
    suffix: .html
    # 在构建 URL 时添加到视图名称前的前缀（默认值： classpath:/templates/ ）
    prefix: classpath:/templates/
    # 要运⽤于模板之上的模板模式。另⻅ StandardTemplate-ModeHandlers( 默认值： HTML5)
    mode: HTML5
    # 要被排除在解析之外的视图名称列表，⽤逗号分隔
    excluded-view-names:
    # 模板编码
    encoding: UTF-8
    # 开启模板缓存（默认值： true ）
    cache: true
    # 检查模板是否存在，然后再呈现
    check-template: true
    # 检查模板位置是否正确（默认值 :true ）
    check-template-location: true
    #Content-Type 的值（默认值： text/html ）
    #    content-type: text/html
    # 开启 MVC Thymeleaf 视图解析（默认值： true ）
    enabled: true
  datasource:
    url: jdbc:mysql://192.168.58.131:3306/basic
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  #  redis
  redis:
    password: 123456
    database: 0
    host: 192.168.58.131
    port: 6379
    # lettuce 使用netty io
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        max-wait: -1ms
        min-idle: 0
    # jedis 开销大 
    #    jedis:
    #      pool:
    #        max-active: 8
    #        max-wait: -1ms
    #        max-idle: 8
    #        min-idle: 0
    connect-timeout: 5s
    timeout: 5s
  kafka:
    bootstrap-servers: 192.168.58.131:9092
    consumer:
      group-id: basic-group
      auto-offset-reset: earliest
      bootstrap-servers: 192.168.58.131:9092

    producer:
      bootstrap-servers: 192.168.58.131:9092
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
  banner:
    image:
      pixelmode: block
    charset: UTF-8
    location: classpath:banner.txt
  output:
    ansi:
      # 检查终端是否支持ANSI，是的话就采用彩色输出
      # detect 检查终端是否支持ANSI，是的话就采用彩色输出
      # always 不检查，总是彩色输出
      # never 禁用彩色输出
      enabled: detect
  application:
    name: demo

logging:
  config: classpath:logback.xml
  charset:
    console: UTF-8

mybatis-plus:
  mapper-locations: classpath:mapper/**/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    banner: off

arthas:
  # telnetPort、httpPort为 -1 ，则不listen telnet端口，为 0 ，则随机telnet端口
  # 如果是防止一个机器上启动多个 arthas端口冲突。可以配置为随机端口，或者配置为 -1，并且通过tunnel server来使用arthas。
  # ~/logs/arthas/arthas.log (用户目录下面)里可以找到具体端口日志
  telnetPort: -1
  httpPort: -1
  # 127.0.0.1只能本地访问，0.0.0.0则可网络访问，但是存在安全问题
  ip: 127.0.0.1
  appName: ${spring.application.name}
  # 默认情况下，会生成随机ID，如果 arthas agent配置了 appName，则生成的agentId会带上appName的前缀。
  #  agent-id: hsehdfsfghhwertyfad
  # tunnel-server地址
  tunnel-server: ws://localhost:7777/ws
```

## logback.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<!--详细介绍使用：https://icode.blog.csdn.net/article/details/88874162-->
<!--debug="true" : 打印 logback 内部状态（默认当 logback 运行出错时才会打印内部状态 ）, 配置该属性后打印条件如下（同时满足）：
    1、找到配置文件 2、配置文件是一个格式正确的xml文件 也可编程实现打印内部状态, 例如： LoggerContext lc = (LoggerContext)
    LoggerFactory.getILoggerFactory(); StatusPrinter.print(lc); -->
<!-- scan="true" ： 自动扫描该配置文件，若有修改则重新加载该配置文件 -->
<!-- scanPeriod="30 seconds" : 配置自动扫面时间间隔（单位可以是：milliseconds, seconds, minutes
    or hours，默认为：milliseconds）， 默认为1分钟，scan="true"时该配置才会生效 -->
<configuration scan="true" scanPeriod="60 seconds" debug="false">
    <!--定义日志文件的存储地址 勿在 LogBack 的配置中使用相对路径-->
    <property name="LOG_HOME" value="logs"/>

    <!--<property name = "CONSOLE_LOG_PATTERN" value = "%red(%d{yyyy-MM-dd HH:mm:ss.SSS}) %red([%thread]) %highlight(%-5level) %boldMagenta(%logger{50}) %cyan(%msg%n)" />-->
    <property name="CONSOLE_LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} %highlight([%thread]) %highlight(%-5level) %cyan(%logger{60}) - [%blue(%method):%cyan(%line)] %msg%n"/>
    <!--控制台日志， 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--
                格式化输出：
                    %d表示日期，
                    %thread表示线程名，
                    %-5level：级别从左显示5个字符宽度,
                    %msg：日志消息，
                    %n是换行符
            -->
            <!--<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>-->
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!--文件日志， 按照每天生成日志文件 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME:-.}/sys-info.log</file>
        <!-- 文件滚动策略根据%d{patter}中的“patter”而定，此处为每天产生一个文件 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--日志文件输出的文件名-->
            <FileNamePattern>${LOG_HOME:-.}/sys-info.log.%d{yyyy-MM-dd}.zip</FileNamePattern>
            <!--日志文件保留天数-->
            <maxHistory>30</maxHistory>
            <!--<maxFileSize>100MB</maxFileSize>-->
            <!--<totalSizeCap>3GB</totalSizeCap>-->
        </rollingPolicy>

        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <!--<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>-->
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>
        <!--日志文件最大的大小-->
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
    </appender>
    <!--error日志-->
    <appender name="file_error" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME:-.}/sys-error.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 按天回滚 daily -->
            <!--日志文件输出的文件名-->
            <fileNamePattern>${LOG_HOME:-.}/sys-error.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 日志最大的历史保留 60天 -->
            <maxHistory>30</maxHistory>
            <maxFileSize>100MB</maxFileSize>
            <totalSizeCap>3GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- 过滤的级别 -->
            <level>ERROR</level>
        </filter>
        <!--日志文件最大的大小-->
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>500MB</MaxFileSize>
        </triggeringPolicy>
    </appender>

    <appender name="SQL_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/sql.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!--日志文件输出的文件名-->
            <FileNamePattern>${LOG_HOME}/sql.log.%d{yyyy-MM-dd}/sql.%i.zip</FileNamePattern>
            <!--日志文件保留天数-->
            <MaxHistory>2</MaxHistory>
            <!--日志文件最大的大小-->
            <MaxFileSize>100MB</MaxFileSize>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!-- 格式化输出: %d: 日期; %-5level: 级别从左显示5个字符宽度; %thread: 线程名; %logger: 类名; %M: 方法名; %line: 行号; %msg: 日志消息; %n: 换行符 -->
            <pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] [%thread] [%logger{50}] [%M] [%line] - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>

    </appender>

    <!--&lt;!&ndash; show parameters for hibernate sql 专为 Hibernate 定制 &ndash;&gt;-->
    <!--<logger name = "org.hibernate.type.descriptor.sql.BasicBinder" level = "TRACE" />-->
    <!--<logger name = "org.hibernate.type.descriptor.sql.BasicExtractor" level = "DEBUG" />-->
    <!--<logger name = "org.hibernate.SQL" level = "DEBUG" />-->
    <!--<logger name = "org.hibernate.engine.QueryParameters" level = "DEBUG" />-->
    <!--<logger name = "org.hibernate.engine.query.HQLQueryPlan" level = "DEBUG" />-->

    <!--&lt;!&ndash;myibatis log configure&ndash;&gt;-->
    <!--<logger name = "com.apache.ibatis" level = "TRACE">-->
    <!--    <appender-ref ref = "FILE" />-->
    <!--</logger>-->
    <!--<logger name = "java.sql.Connection" level = "DEBUG" />-->
    <!--<logger name = "java.sql.Statement" level = "DEBUG" />-->
    <!--<logger name = "java.sql.PreparedStatement" level = "DEBUG" />-->

    <!-- 日志输出级别 -->
    <root level="info">
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="SQL_FILE"/>
        <appender-ref ref="file_error"/>
    </root>

</configuration>
```