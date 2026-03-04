0. 桌面版linux 请使用普通用户进行 

    不要使用root用户!!!
    不要使用root用户!!!
    不要使用root用户!!!

1. 卸载旧版本jetbrains
   安装目录
   $HOME/.config/JetBrains/安装ide
   $HOME/.local/share/JetBrains/安装ide
   $HOME/.cache/JetBrains/安装ide

2. 解压新版本ide

3. cd 解压目录/bin

4. 执行./ide.sh 如： ./idea.sh ./goland.sh

5. 然后关闭窗口

6. cd $HOME/.config/JetBrains/安装ide/

7. 创建ide64.vmoptions 如 idea64.vmoptions goland64.vmoptions

8. 粘贴以下内容

-Xmx2048m
-XX:ReservedCodeCacheSize=512m
-Xms128m
-XX:+UseG1GC

-XX:+IgnoreUnrecognizedVMOptions


-XX:SoftRefLRUPolicyMSPerMB=50
-XX:CICompilerCount=2
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
-ea
-Dsun.io.useCanonCaches=false
-Djdk.http.auth.tunneling.disabledSchemes=""
-Djdk.attach.allowAttachSelf=true
-Djdk.module.illegalAccess.silent=true
-Dkotlinx.coroutines.debug=off
-Dsun.tools.attach.tmp.only=true

-XX:ErrorFile=$USER_HOME/java_error_in_idea_%p.log
-XX:HeapDumpPath=$USER_HOME/java_error_in_idea.hprof

--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED

# /usr/local/dev/jetbra/ 是jetbra.zip解压目录
-javaagent:/usr/local/dev/jetbra/ja-netfilter.jar=jetbrains

9. 执行ide.sh 启动窗口复制jetbra文件夹中的激活码进行激活

