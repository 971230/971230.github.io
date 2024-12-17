---
title: 和Git相关的
description: 和Git相关的
---

!!! Note
    其实开发的时候一般用的都是图形化工具，但是git命令这个也是属于基本功，仍然不能忘记。

## 创建本地库并上传到指定分支

```shell
git init
git add .  --把当前目录下的所有文件受git管理
git commit -m "提交的注释信息"  --提交改动
git remote add origin 项目地址  --关联项目地址
git push origin master --提交至主分支
git clone -b xxx 地址  --clone指定分支
```

## 绑定git账号

```shell
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
ssh-keygen -t rsa -C "youremail@example.com"
```

## 代码写一半切分支(也可以commit后撤销)

```shell
git stash -- 暂存更改
git stash pop -- 应用最近的暂存，同时删除该暂存
git stash list -- 查看所有暂存
git stash clear -- 清除所有暂存
git stash drop <stashId> -- 删除特定暂存
git stash apply <stashId> -- 应用特定暂存而不删除
```

### 不慎清空了暂存区但需要找回数据

```shell
git fsck --lost-found -- 查找未关联的提交对象。
git show <commitId> -- 查看指定提交的具体内容。
git merge <commitId> -- 合并指定提交到当前分支。
```

## 取消代理

```shell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 查看代理

```shell
git config --global --get http.proxy
git config --global --get https.proxy
git config --global -l --查看git设置

git reset --hard HEAD^   --更新代码后回滚到上一个版本 !!!注意会损失已提交代码
git reset --hard HEAD^^  --更新代码后回滚到上两个版本
git reset --hard commitID  --更新代码后回滚到指定版本
–soft 不删除工作空间的改动代码 ，撤销commit，不撤销git add file
–hard 删除工作空间的改动代码，撤销commit且撤销add
```
