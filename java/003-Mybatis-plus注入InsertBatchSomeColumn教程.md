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

完整sql

```java
@Component
@Intercepts({
        @Signature(
                type = StatementHandler.class,
                method = "prepare",
                args = {
                        Connection.class,
                        Integer.class
                }
        )
})
public class MybatisPlusInterceptor implements Interceptor {
    private static final Logger L = LoggerFactory.getLogger(MybatisPlusInterceptor.class);

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
        //        Interceptor.super.setProperties(properties);
    }

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        //通过MetaObject优雅访问对象的属性，这里是访问statementHandler的属性;：
        // MetaObject是Mybatis提供的一个用于方便、
        //优雅访问对象属性的对象，通过它可以简化代码、不需要try/catch各种reflect异常，
        // 同时它支持对JavaBean、Collection、Map三种类型对象的操作。
        MetaObject metaObject = MetaObject.forObject(statementHandler,
                SystemMetaObject.DEFAULT_OBJECT_FACTORY,
                SystemMetaObject.DEFAULT_OBJECT_WRAPPER_FACTORY,
                new DefaultReflectorFactory());
        //先拦截到RoutingStatementHandler，里面有个StatementHandler类型的delegate变量，
        // 其实现类是BaseStatementHandler，
        // 然后就到BaseStatementHandler的成员变量mappedStatement
        MappedStatement mappedStatement = (MappedStatement) metaObject.getValue(
                "delegate.mappedStatement");
        //id为执行的mapper方法的全路径名，如com.uv.dao.UserMapper.insertUser
        String id = mappedStatement.getId();
        L.info("id ==> " + id);
        //sql语句类型 select、delete、insert、update
        String sqlCommandType = mappedStatement.getSqlCommandType().toString();
        L.info("类型 ==> " + sqlCommandType);

        BoundSql boundSql = statementHandler.getBoundSql();

        // 获取节点的配置
        Configuration configuration = mappedStatement.getConfiguration();
        // 获取到最终的sql语句
        String newSql = getSql(configuration, boundSql, id);
        L.info("SQL ==>: " + newSql);
        long start = System.currentTimeMillis();
        Object returnValue = invocation.proceed();
        long end = System.currentTimeMillis();
        long time = (end - start);
        L.info("sql耗时 ==>: " + time);
        return returnValue;
        //        return null;
    }

    /**
     * 封装了一下sql语句，
     * 使得结果返回完整xml路径下的sql语句节点id + sql语句
     *
     * @param configuration:
     * @param boundSql:
     * @param sqlId:
     *
     * @return string
     */
    private String getSql(Configuration configuration, BoundSql boundSql, String sqlId) {
        String sql = showSql(configuration, boundSql);
        return sqlId + ":" + sql;
        //        return sql;
    }

    /**
     * 如果参数是String，则添加单引号， 如果是日期，则转换为时间格式器并加单引号；
     * 对参数是null和不是null的情况作了处理<br>
     *
     * @param obj:
     *
     * @return string
     */
    private String getParameterValue(Object obj) {
        String value;
        if (obj instanceof String) {
            value = "'" + obj + "'";
        } else if (obj instanceof Date) {
            DateFormat formatter = DateFormat.getDateTimeInstance(DateFormat.DEFAULT,
                    DateFormat.DEFAULT, Locale.CHINA);
            value = "'" + formatter.format(new Date()) + "'";
        } else {
            if (obj != null) {
                value = obj.toString();
            } else {
                value = "";
            }

        }
        return value;
    }

    /**
     * 进行？的替换
     *
     * @param configuration:
     * @param boundSql:
     *
     * @return string
     */
    public String showSql(Configuration configuration, BoundSql boundSql) {
        // 获取参数
        Object parameterObject = boundSql.getParameterObject();
        List<ParameterMapping> parameterMappings = boundSql
                .getParameterMappings();
        // sql语句中多个空格都用一个空格代替
        String sql = boundSql.getSql().replaceAll("[\\s]+", " ");
        if (CollectionUtils.isNotEmpty(parameterMappings) && parameterObject != null) {
            // 获取类型处理器注册器，类型处理器的功能是进行java类型和数据库类型的转换　　　　　　　
            // 如果根据parameterObject.getClass(）可以找到对应的类型，则替换
            TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();
            if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
                sql = sql.replaceFirst("\\?",
                        Matcher.quoteReplacement(getParameterValue(parameterObject)));
            } else {
                //MetaObject主要是封装了originalObject对象，
                // 提供了get和set的方法用于获取和设置originalObject的属性值,
                // 主要支持对JavaBean、Collection、Map三种类型对象的操作
                MetaObject metaObject = configuration.newMetaObject(parameterObject);
                for (ParameterMapping parameterMapping : parameterMappings) {
                    String propertyName = parameterMapping.getProperty();
                    if (metaObject.hasGetter(propertyName)) {
                        Object obj = metaObject.getValue(propertyName);
                        sql = sql.replaceFirst("\\?",
                                Matcher.quoteReplacement(getParameterValue(obj)));
                    } else if (boundSql.hasAdditionalParameter(propertyName)) {
                        // 该分支是动态sql
                        Object obj = boundSql.getAdditionalParameter(propertyName);
                        sql = sql.replaceFirst("\\?",
                                Matcher.quoteReplacement(getParameterValue(obj)));
                    } else {
                        //打印出缺失，提醒该参数缺失并防止错位
                        sql = sql.replaceFirst("\\?",
                                "缺失");
                    }
                }
            }
        }
        return sql;
    }

}


```