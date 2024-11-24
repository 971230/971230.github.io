---
title: 和Linux系统相关的
description: 和Linux系统相关的
---

## 解决Ubuntu root用户下java -version无法获取java环境变量解决办法，普通用户可以bug

```properties title="Java环境变量配置"
export JAVA_HOME=/usr/local/java/jdk1.8.0_351
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
```

```properties title="解决方式"
sudo ln -s /你的jdk路径/bin/jar /bin/jar 
sudo ln -s /你的jdk路径/bin/java /bin/java 
sudo ln -s /你的jdk路径/bin/javac /bin/javac 
sudo ln -s /你的jdk路径/bin/javah /bin/javah 
sudo ln -s /你的jdk路径/bin/javadoc /bin/javadoc
```