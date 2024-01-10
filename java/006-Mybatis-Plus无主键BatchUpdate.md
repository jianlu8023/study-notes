# Mybatis-Plus无主键BatchUpdate

使用MybatisPlus中SqlHelper.saveOrUpdateBatch进行批量更新操作。

mybatisPlus SqlHelper.saveOrUpdateBatch源码
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

## 实例

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
    Boolean updateBatchByQueryWrapper(Collection<ExampleEntity> entityList, Function<ExampleEntity, QueryWrapper<ExampleEntity>> queryFunction);
}
```


ExampleEntityServiceImpl.java

```java
@Service
public class ExampleEntityServiceImpl extends ServiceImpl<ExampleEntityMapper, ExampleEntity>
        implements ExampleEntityService {

    /**
     * updateBatchByQueryWrapper
     * <p>
     * create time: 2024/1/10 上午11:58
     * create by: ght
     *
     * @param entityList    :
     * @param queryFunction :
     *
     * @return Boolean
     */
    public Boolean updateBatchByQueryWrapper(Collection<ExampleEntity> entityList, Function<ExampleEntity, QueryWrapper<ExampleEntity>> queryFunction) {
        return SqlHelper.saveOrUpdateBatch(
		// 这里直接传入实体class文件的原因是因为要通过反射获取实体相关变量
		// 传入this.entityClass则传入的是动态代理后的对象 无法获取相关信息
		ExampleEntity.class,
		// 同上
                FilerecordMapper.class,
                // 日志log 传入使用slf4j获取的log
		LogFactory.getLog(ExampleEntityServiceImpl.class),
                // 要批量更新的实体
		entityList,
		// 批次大小 此值为1000 在内部执行时会进行Math.min(entityList.size(),DEFAULT_BATCH_SIZE)
                DEFAULT_BATCH_SIZE,
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
                (sqlSession, entity) -> {
                    Map<String, Object> param = new HashMap<>();
                    param.put(Constants.ENTITY, entity);
                    param.put(Constants.WRAPPER, queryFunction.apply(entity));
                    sqlSession.update(this.getSqlStatement(SqlMethod.UPDATE), param);
                });
    }
}
```







