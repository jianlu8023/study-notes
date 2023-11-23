# mybatis-plus 注入 InsertBatchSomeColumn 教程

## mybatis-plus:3.5.3.2

* 引入依赖

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.2</version>
</dependency>
```

* 继承BaseMapper

```java
public interface BatchInsertBaseMapper<T> extends BaseMapper<T> {
    /**
     * insertBatchSomeColumn
     * <p>
     * create time: 2023/11/23 下午1:34
     * create by: ght
     *
     * @param batchInsertList :
     *
     * @return Integer
     */
    Integer insertBatchSomeColumn(List<T> batchInsertList);
}
```

* 继承DefaultInjector

Tips: 此类不使用@Component

```java
public class EasySqlInjector extends DefaultSqlInjector {
    @Override
    public List<AbstractMethod> getMethodList(Class<?> mapperClass, TableInfo tableInfo) {
        List<AbstractMethod> methodList = super.getMethodList(mapperClass, tableInfo);
        methodList.add(new InsertBatchSomeColumn(i -> i.getFieldFill() != FieldFill.UPDATE));
        return methodList;
    }
}
```

* 注入实现的injector

```java
@Configuration
public class MyBatisPlusBatchInsertConfiguration {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        //添加分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        //添加乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
    @Bean
    public EasySqlInjector easySqlInjector() {
        return new EasySqlInjector();
    }
}
```

* 使用

Tips: 完成以上步骤后，直接继承已经继承BaseMapper的类(BatchInsertBaseMapper)

```java
@Mapper
public interface FilerecordMapper extends BatchInsertBaseMapper<Filerecord> {

}
```

* 注意事项：

1. public key retrieval is not allowed问题解决

Tips: 在url后加allowPublicKeyRetrieval=true配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/basic?clobAsString=1&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=GMT%2B8&allowPublicKeyRetrieval=true
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

```

2. 开启日志

Tips: 正式环境请勿打开日志

```yaml
mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

