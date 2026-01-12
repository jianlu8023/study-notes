# EntityUtils整合

说明: 当存在若干实体类，并且需要根据不同情况，创建不同的实体对象时，如果手动去setter方式创建对象很麻烦，做vo转换时也很麻烦，将转换进行抽取形成方法。

## 步骤

1. 编写sourceEntity

```java
public class SourceEntity{

	private String userName;
	private Integer age;
	private Boolean sex;
	private Float score;

	// constructor
	// getter and setter
	// equals and hash
	// toString

}
```

2. 编写EntityUtils工具类

```java
public class EntityUtils{

	public static <T> T createEntity(SourceEntity source,Class<T> clazz){
		T entity = clazz.newInstance();
		for (PropertyDescriptor targetPropertyDescriptor :Introspector.getBeanInfo(clazz).getPropertyDescriptors()) {
            		Method targetSetter = targetPropertyDescriptor.getWriteMethod();
            		if (targetSetter != null) {
                		PropertyDescriptor sourcePropertyDescriptor = new PropertyDescriptor(targetPropertyDescriptor.getName(), source.getClass());
                		Method sourceGetter = sourcePropertyDescriptor.getReadMethod();
                		if (sourceGetter != null) {
                    			Object value = sourceGetter.invoke(source);
                    			targetSetter.invoke(entity, value);
                		}
            		}
        	}
        	return entity;
	}	
}
```
