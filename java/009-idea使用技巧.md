# idea使用技巧

## logger 

```text
1. idea->settings->editor->live templates

2. 创建group

3. 创建template

3.1 abbreviation 
	logger 

3.2 template text 
	private static final Logger L = LoggerFactory.getLogger($className$.class);

3.3 edit variables 
	name		expression
	className	className()

3.4 最下角 change 
	选择java
```

## todo

```text
1. xxx
2. xxx
3. xxx
3.1 abbreviation
	td
3.2 template text 
	// TODO: $date$
3.3 edit variables
	name		expreesion
	date		date("yyyy-MM-dd HH:mm:ss")
3.4 左下角 change
	选择java
```

## 注释

```text
1. xxx
2. xxx
3. xxx
3.1 abbreviation
	zs
3.2 template text
** 
 * $funcName$
 * 
 * create time: $date$ $time$
 * 
 * create by: ght
 *
 * $param$
 * 
 * $return$
 */
3.3 edit variables
	name 		expreesion

	funcName	groovyScript(" def result=''; def name=\"${_1}\"; if(name == ''){return result;}; if(name == 'null'){return result;}; result = name; return result;", methodName())

	date		date()

	time		time()

	param 		groovyScript(" def result=''; if(\"${_1}}\" == \"\") return result; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); if(params.size() == 0) return result; for(i = 0; i < params.size(); i++) { if(i!=0) result+= ' * '; if(params[i] == 'null') continue; if(params[i] == 'NULL') continue; if(params[i] == '') continue; result+='@param ' + params[i] + ' : ' +((i < (params.size() - 1)) ? '\\n' : ''); }; return result", methodParameters()) }

	return 		groovyScript("def result='';if(\"${_1}}\" == \"\") return result; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split('<').toList(); for(i = 0; i < params.size(); i++){ if( i==0 ){ if( params[i] == '')continue; if(params[i] == 'null') continue; if(params[i] == 'NULL') continue; if(params[i] == 'void') continue; result+='@return '; }; if(i!=0){result+='<';}; def p1=params[i].split(',').toList(); for(i2 = 0; i2 < p1.size(); i2++) { def p2=p1[i2].split('\\\\.').toList(); result+=p2[p2.size()-1]; if(i2!=p1.size()-1){result+=','} }; }; return result",methodReturnType()) 	

3.4 左下角 change 
	选择java
```

