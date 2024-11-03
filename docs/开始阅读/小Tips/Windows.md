---
title: 和Windows系统相关的
description: 和Windows系统相关的
---

## 1.如何在Windows系统上查看端口号被什么应用程序占用？
1️⃣cmd可以使用如下命令
``` shell
netstat -ano | findstr :8080
```
此时会输出：
``` txt
TCP    192.168.0.104:2046     183.60.8.74:8080       ESTABLISHED     13396
```
然后拿着最后的13396这个pid去查程序名
``` shell
tasklist /FI "PID eq 13396"
```
就会显示如下信息
``` txt
映像名称                       PID 会话名              会话#       内存使用
========================= ======== ================ =========== ============
WeChat.exe                   13396 Console                    2    498,380 K
```

2️⃣PowerShell则简单一些
``` powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess
```

3️⃣也可以使用Windows的`资源监视器`，但是要以各个自己看，也比较麻烦
打开`任务管理器`里面的`性能`，找到`资源监视器`(win11是右上角三个...)，翻到网络选项，这时候就需要一个个自己翻找了。