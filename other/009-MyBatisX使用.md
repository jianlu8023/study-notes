# MyBatisX插件使用

## 步骤

1. 安装插件

> JetBrains系列IDE软件
>
>> File -> Settings -> Plugins -> Marketplace -> MyBatisX

2. 连接数据库

> JetBrains系列IDE软件
>
>> ![](../img/MyBatisX-001.png)
>
>> ![](../img/MyBatisX-002.png)

3. 选择要逆向生成的表

> 以nunu库user表做演示
>
> 在user表右键
>
>> ![](../img/MyBatisX-003.png)
>
> 选择MybatisX-Generator
>
> 注意点:
> 1 base package 填写 Application所在包名</br>
> 2 base path 保持src/main/java不变</br>
> 3 relative package 实体类包名 如 entity</br>
> 4 extra class suffix 实体类后缀 如 Entity</br>
> 5 class name strategy 选择camel / same as tablename</br>
>
>> ![](../img/MyBatisX-004.png)
>
>  点击下一步
>
> 注意点
> 1 annotation 注解类型 按需选</br>
> 2 options 选项 按需选</br>
> 3 template 模板 按需选</br>
>> ![](../img/MyBatisX-005.png)
>
> 点击finish