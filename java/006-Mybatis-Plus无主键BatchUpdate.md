# Mybatis-Plus无主键BatchUpdate

使用MybatisPlus中SqlHelper.saveOrUpdateBatch实现根据某个或者多个非ID字段进行批量更新。

mybatisPlus SqlHelper.saveOrUpdateBatch源码
调用方法

```java
    public static <E> boolean saveOrUpdateBatch(Class<?> entityClass, Class<?> mapper, Log log, Collection<E> list, int batchSize, BiPredicate<SqlSession, E> predicate, BiConsumer<SqlSession, E> consumer) {
        String sqlStatement = getSqlStatement(mapper, SqlMethod.INSERT_ONE);
        return executeBatch(entityClass, log, list, batchSize, (sqlSession, entity) -> {
            if (predicate.test(sqlSession, entity)) {
                sqlSession.insert(sqlStatement, entity);
            } else {
                consumer.accept(sqlSession, entity);
            }
        });
    }
```

首先调用

```java
    @Deprecated
    public static <E> boolean executeBatch(Class<?> entityClass, Log log, Collection<E> list, int batchSize, BiConsumer<SqlSession, E> consumer) {
        return executeBatch(sqlSessionFactory(entityClass), log, list, batchSize, consumer);
    }
```

然后调用

```java
    public static <E> boolean executeBatch(SqlSessionFactory sqlSessionFactory, Log log, Collection<E> list, int batchSize, BiConsumer<SqlSession, E> consumer) {
        Assert.isFalse(batchSize < 1, "batchSize must not be less than one", new Object[0]);
        return !CollectionUtils.isEmpty(list) && executeBatch(sqlSessionFactory, log, (sqlSession) -> {
            int size = list.size();
            int idxLimit = Math.min(batchSize, size);
            int i = 1;

            for(Iterator var7 = list.iterator(); var7.hasNext(); ++i) {
                E element = var7.next();
                consumer.accept(sqlSession, element);
                if (i == idxLimit) {
                    sqlSession.flushStatements();
                    idxLimit = Math.min(idxLimit + batchSize, size);
                }
            }

        });
    }

```

## 根据wrapper条件进行批量更新

ExampleEntity.java
```java
@TableName(value ="example")
public class ExampleEntity implements Serializable {
    /**
     * 文件id
     */
    @TableField(value = "id")
    private String id;

    /**
     * 名称
     */
    @TableField(value = "name")
    private String name;

    /**
     * 描述
     */
    @TableField(value = "describe")
    private String describe;

    /**
     * 创建时间
     */
    @TableField(value = "createTime")
    private String createTime;

    /**
     * 本条记录的MD5
     */
    @TableField(value = "recordMD5")
    private String recordMD5;

    /**
     * 记录是否被删除
     */
    @TableField(value = "isDelete")
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
```

ExampleEntityMapper.java
```java
@Mapper
public interface ExampleEntityMapper extends BaseMapper<ExampleEntity> {
}
```


ExampleEntityService.java

```java
public interface ExampleEntityService extends IService<ExampleEntityEntity> {
    Boolean updateBatch(Collection<ExampleEntity> entityList, Function<ExampleEntity, QueryWrapper<ExampleEntity>> queryFunction);
    Boolean updateBatchSomeColumn(Collection<ExampleEntity> entityList, Function<ExampleEntity, QueryWrapper<ExampleEntity>> queryFunction);
}
```


ExampleEntityServiceImpl.java

```java
@Service
public class ExampleEntityServiceImpl extends ServiceImpl<ExampleEntityMapper, ExampleEntity>
        implements ExampleEntityService {

    public Boolean updateBatch(Collection<ExampleEntity> entityList, Function<ExampleEntity, QueryWrapper<ExampleEntity>> queryFunction){
	String sqlStatement = this.getSqlStatement(SqlMethod.UPDATE);
        return this.executeBatch(entityList, DEFAULT_BATCH_SIZE, (sqlSession, entity) -> {
            Map<String, Object> param = CollectionUtils.newHashMapWithExpectedSize(2);
            param.put(Constants.ENTITY, entity);
            param.put(Constants.WRAPPER, wrapperFunction.apply(entity));
            sqlSession.update(sqlStatement, param);
        });
    }

    public Boolean updateBatchSomeColumn(Collection<ExampleEntity> entityList, Function<ExampleEntity, QueryWrapper<ExampleEntity>> queryFunction) {
        return SqlHelper.saveOrUpdateBatch(
		// 传入this.entityClass则传入的是动态代理后的对象，不是原来的类 
		ExampleEntity.class,
		// 同上
                FilerecordMapper.class,
                // 日志log 传入使用slf4j获取的log
		LogFactory.getLog(ExampleEntityServiceImpl.class),
                // 要批量更新的实体
		entityList,
		// 批次大小 此值为1000 在内部执行时会进行Math.min(entityList.size(),DEFAULT_BATCH_SIZE)
                DEFAULT_BATCH_SIZE,
		// 在这里随你想做什么就做什么，最后返回一个boolean类型就行了。返回的boolean用于后面判断是新增还是编辑
		// BiPredicate 进行验证
		// if (predicate.test(sqlSession, entity)) {
                //     sqlSession.insert(sqlStatement, entity);
		// }
                (sqlSession, entity) -> {
                    // 方式1
		    // Map<String, Object> param = new HashMap<>();
                    // param.put(Constants.ENTITY, entity);
                    // param.put(Constants.WRAPPER, queryFunction.apply(entity));
                    // return CollectionUtils.isEmpty(sqlSession.selectList(this.getSqlStatement(SqlMethod.SELECT_MAPS), param));
                    // 方式2
		    return CollectionUtils.isEmpty(sqlSession.selectList(this.getSqlStatement(SqlMethod.SELECT_BY_ID), entity));
                },
		// 更新操作 根据传入的wrapper进行更新操作
		// 想干嘛就干嘛,这里面主要用来做编辑（update）操作，由于源码中没有执行sqlSession.update()方法，因此这里的编辑方法得自己写。
                (sqlSession, entity) -> {
                    Map<String, Object> param = new HashMap<>();
                    param.put(Constants.ENTITY, entity);
                    param.put(Constants.WRAPPER, queryFunction.apply(entity));
                    sqlSession.update(this.getSqlStatement(SqlMethod.UPDATE), param);
                });
    }
}
```

## 调用ServiceImpl的saveOrUpdateBatch()方法

Tips: 调用serviceImpl的saveOrUpdateBatch()方法时是根据主键进行更新，由于表中没有主键且存在相同的记录会进行全部更新

```java

public class DemoServiceImple implements DemoService{


	@Autowired
	private ExampleService exampleService;


	public boolean saveOrUpdateEntityList(List<DemoEntity> entityList){
		return exampleService.saveOrUpdateBatch(entityList);
	}
}
```

此过程调用的saveOrUpdateBatch方法

底层也是调用SqlHelper.saveOrUpdateBatch方法

Tips: 在这里entityClass mapperClass 传值为this.entityClass 原因是 在此service实现类中针对这两个class参数进行处理。

```java
public class ServiceImpl<M extends BaseMapper<T>, T> implements IService<T> {
    protected final Class<?>[] typeArguments = GenericTypeUtils.resolveTypeArguments(this.getClass(), ServiceImpl.class);
    protected Class<T> entityClass = this.currentModelClass();
    protected Class<M> mapperClass = this.currentMapperClass();
     protected Class<M> currentMapperClass() {
        return this.typeArguments[0];
    }

    protected Class<T> currentModelClass() {
        return this.typeArguments[1];
    }

    // ------------------------------- 上方解释为什么在此类中可以传this. ------------------------------------
    @Transactional(
        rollbackFor = {Exception.class}
    )
    public boolean saveOrUpdateBatch(Collection<T> entityList, int batchSize) {
        TableInfo tableInfo = TableInfoHelper.getTableInfo(this.entityClass);
        Assert.notNull(tableInfo, "error: can not execute. because can not find cache of TableInfo for entity!", new Object[0]);
        String keyProperty = tableInfo.getKeyProperty();
        Assert.notEmpty(keyProperty, "error: can not execute. because can not find column for id from entity!", new Object[0]);
        return SqlHelper.saveOrUpdateBatch(this.entityClass, this.mapperClass, this.log, entityList, batchSize, (sqlSession, entity) -> {
            Object idVal = tableInfo.getPropertyValue(entity, keyProperty);
            return StringUtils.checkValNull(idVal) || CollectionUtils.isEmpty(sqlSession.selectList(this.getSqlStatement(SqlMethod.SELECT_BY_ID), entity));
        }, (sqlSession, entity) -> {
            ParamMap<T> param = new ParamMap();
            param.put("et", entity);
            sqlSession.update(this.getSqlStatement(SqlMethod.UPDATE_BY_ID), param);
        });
    }
}
```





