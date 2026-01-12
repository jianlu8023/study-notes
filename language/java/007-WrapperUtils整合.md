# WrapperUtils整合

## 每个方法都需要实现wrapper，并且根据不同的查询条件进行定制时，但是idea中由于代码重复，会标黄，处理方案。

1. 定义WrapperParams类存放所有查询条件

```java
public class WrapperParams {

	private String param1;
	private Ineteger param2;
	private Date param3;
	private Boolean param4;
	private Byte param5;
	// ...
}
```


2. 定义WrapperCreate方法

Tips: 这里将类名进行常量定义到Constants类中，魔法值都进行常量设置，也可避免idea标黄等问题。

```java
public class WrapperUtils {

    public static <T> Wrapper<T> createQueryWrapper(WrapperParams params, Class<T> clazz) {
        String simpleName = clazz.getSimpleName();
        switch (simpleName) {
            case Constants.CLASS_DEMO_USER:
                return newDemoUserWrapper(params);
            default:
                return defaultWrapper();
        }
    }
    private static <T> Wrapper<T> defaultWrapper() {
        return new LambdaQueryWrapper<>();
    }
    private static <T> Wrapper<T> newDemoUserWrapper(WrapperParams params) {
	// params.gettter
	LambdaQueryWrapper<T> wrapper = new LambdaQueryWrapper<>();
	
	// params处理逻辑 eq orderBy eqAll等等
	
        return wrapper;
    }
}
```

3. 调用

```java
@SpringBootTest
public class WrapperUtilsTest{

	@AutoWired
	private DemoUserMapper userMapper;

	@Test
	void demoUserWrapperUtilsTest(){
		Wrapper<DemoUserEntity> wrapper = WrapperUtils.createQueryWrapper(new WrapperParams(),DemoUserEntity.class);
		List<DemoUserEntity> queryList = userMapper.selectList(wrapper);
		queryList.forEach(System.out::println);
	}
}
```
