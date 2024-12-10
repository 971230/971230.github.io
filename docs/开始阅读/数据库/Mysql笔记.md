---
title: Mysql笔记
description: Mysql笔记-大学期间笔记
---

## 一.数据库概述

-----

## 1️⃣什么是数据库

数据库最基本的定义是指相关信息的集合<br>
数据库（Database）是按照 <u>***数据结构***</u> 来组织、存储和管理数据的仓库<br>
在计算机科学中，“数据库”被定义为 <u>***以数据形式存储***</u> 在计算机系统上的<u>***信息的集合***</u>

!!! Abstract "数据库的分类"
    - 早期: 层次式数据库(`IBM IMS`,`TOTAL`), 网络型数据库(`CODASYL`, `IDMS`)
	- 现在: 关系型数据库(`Oracle`, `MySQL`, `SQL Server`, `PostgreSQL`, `SQLite`, `MariaDB`), 非关系型数据库(`Redis`, `MongoDB`)
	- 现在市面上大部分用的还是关系型数据库

-----

## 2️⃣什么是关系型数据库

​	底层以 **二维表** 的形式保存数据的库,就是关系型数据库
​	常见的关系型数据库有哪些?

!!! Success ""
	- <u>**Oracle**</u>: 甲骨文公司提供的一款数据库产品,收费的,之前在Java中的市场份额超过50% 。主要适用于一些大型或者超大型应用系统。
	- <u>**SQL Server**</u>: 微软提供的一款数据库产品,收费,主要适用于一些中型或者大型的应用系统
	- <u>**MySQL**</u>: 瑞典的一个公司(MySQLAB)提供的一款数据库产品,特点是小巧轻量,简单易用,适用于一些小型或中型的应用系统,如果做mysql集群,也可以用于一些大型或者超大型系统。免费！mysql目前已经被甲骨文收购了
	- <u>**DB2**</u>: IBM公司提供的一款数据库产品, 用于金融/银行等系统较多, 收费!
	- <u>**SQLite**</u>: 迷你数据库, 用于嵌入式设备(手机/智能家居等产品)

-----

## 3️⃣数据库相关名字解释

<u>**数据库服务器**</u>: 其实就是你安装的哪个mysql软件,将mysql安装在计算机上,那么这台计算机就可以作为数据库服务器使用,可以实现数据的存和取。一个数据库服务器中可以包含多个数据库。

!!! Note "比如：装好的mysql服务器中自带了四个数据库"
	```shell
	+-----------------------------+
	| Database                    |
	+-----------------------------+
	| information_schema          |
	| mysql                       |
	| performance_schema          |
	| test                        |
	+-----------------------------+
	```

<u>**数据库**</u>: 数据库就是存储数据的仓库，通常情况下一个网站（系统）中的所有数据会存放在一个数据库中
		京东网站的所有数据		db_jd
		淘宝网站的所有数据		db_taobao
		百度网站的所有数据		db_baidu

<u>**表**</u>: 数据库中的数据是安装类型存放的, 一类数据往往存储在一张表中, 一个数据库中可以创建多张表!
		京东网站的用户数据		tb_user
		京东网站的商品数据		tb_product
		京东网站的订单数据		tb_order

<u>**表记录**</u>: 一张表中可以包含多行表记录, 一张表中用于存储一类信息, 一行表记录就用于存储某一个具体的数据
 		数据库中的表		java中的类(student)
 		表记录			        对象

-----

## 4️⃣SQL语言

1. SQL语言是一门操作关系型数据库的通用的语言(学会了SQL可以操作所有的关系型数据库)
2. SQL语言可以操作的有:
   	* [x] 查看库、创建库、删除库、修改库
    * [x] 创建表、删除表、修改表、查看表
    * [x] 新增表记录、删除表记录、修改表记录、查询表记录(数据)
    * [x] 存储过程/视图/索引等也可以操作
3. SQL语言是一门通用的操作关系型数据库的语言,但每个数据库厂商为了增强自己数据库的功能,都提供了少量的"方言"(独有的SQL语句),SQL语言通用,但方言不通用!

-----

## 5️⃣如何连接mysql服务器(cmd窗口)

- 方式一: `mysql -u用户名 -p密码`
mysql中默认有一个超级管理员(具有所有权限),用户名就是root
- 方式二: `mysql -u用户名 -p`
在下一行键入密码
- 方式三: `mysql -u用户名 -p -h主机名或ip地址 -P端口`
	* -h: 后面跟的是主机名或ip地址,如果不写-h,默认连接localhost(127.0.0.1)
	* -P: 后面跟的是端口, 如果不写-P,默认端口是3306

- 退出连接mysql服务器: exit quit 或者直接关闭窗口
- 扩展内容: SQL注释

```sql
-- 单行注释(注意--后面的空格不要省去)
#单行注释
/* 多行注释 */
```

!!! Warning "注意"
	++ctrl++ ➕ ++c++ 会取消当前sql语句的执行

-----

## 二.数据库及表操作

## 1️⃣创建、删除、查看数据库

### ①查看mysql服务器中所有数据库

```sql
show databases;
```

### ②进入某一数据库（进入数据库后，才能操作库中的表和表记录）

<span style="text-decoration: underline wavy;">语法：USE 库名;</span>

```sql
use mysql; -- 进入mysql数据库
use test;  -- 进入test数据库
```

查看已进入的库

```sql
select database();
```

### ③查看当前数据库中的所有表

先进入某一个库,再查看当前库中的所有表

```sql
use test;
show tables;
```

### ④删除mydb库

<span style="text-decoration: underline wavy;">语法：DROP DATABASE 库名;</span>

```sql
drop database test; -- 删除test库
drop database mydb; -- 删除mydb库,如果删除的库不存在,会报错!
```

当删除的库不存在时，如何避免错误产生?

```sql
-- 删除mydb库,如果存在则删除mydb,如果不存在则不执行删除操作,也不会报错
drop database if exists mydb; 
```

### ⑤重新创建mydb库，指定编码为utf8

<span style="text-decoration: underline wavy;">语法：CREATE DATABASE 库名 CHARSET 编码;<span>

```sql
-- 需要注意的是，mysql中不支持横杠（-），所以utf-8要写成utf8;
create database mydb charset utf8;
-- 如果不存在则创建mydb,如果已存在,则不执行创建操作,也就不会报错了!
create database if not exists mydb charset utf8;
```

### ⑥查看建库时的语句（并验证数据库库使用的编码）

<span style="text-decoration: underline wavy;">语法：SHOW CREATE DATABASE 库名;</span>

```sql
show create database mydb;
```

-----

## 2️⃣创建、删除、查看表

### ⑦进入mydb库，删除stu学生表(如果存在)

<span style="text-decoration: underline wavy;">语法：DROP TABLE 表名;</span>

```sql
use mydb;
drop table if exists stu;
```

### ⑧创建stu学生表(编号[数值类型]、姓名、性别、出生年月、考试成绩[浮点型])

<span style="text-decoration: underline wavy;">建表的语法：CREATE TABLE 表名(列名 数据类型, 列名 数据类型, ... 列名 数据类型);</span>

创建stu表的SQL语句如下:

```sql
create table stu(
	id int,
	name varchar(50), -- 50表示最多存50个字符
	gender varchar(10), 
	birthday date,
	score double
);-- mysql中也有数据类型,这里先使用,后面再做说明!
```

### ⑨查看stu学生表结构

```sql
desc stu;
```

-----

## 3️⃣新增、更新、删除表记录

### ⑩往学生表(stu)中插入记录(数据)

<span style="text-decoration: underline wavy;">语法：INSERT INTO 表名(列名1,列名2,列名3...) VALUES(值1,值2,值3...);</span>

!!! Warning "注意事项"
	1. 创建mydb库时一定要指定编码utf8,这样在库中创建的表也是utf8编码
	2. 如果是在cmd中执行插入记录的语句,先 `set names gbk;` 再插入记录!
	3. mysql中推荐使用单引号包裹字符串和日期(有些版本的数据库双引号包裹会报错!)
	4. 一个cmd窗口只需要设置一次(set names gbk;)编码
	5. <span class="yellow">注意: 如果是要给表中的所有列都插入值,列名可以省略不写, 值的个数和顺序必须和表中创建的列的个数和顺序保持一致!<span>
	6. value后面只能跟一个括号,只能一次插入一条记录,values后面可以跟多个括号,用逗号分隔,一次可以插入多条数据!

```sql
insert into stu(id, name, gender, birthday, score) value(1, 'tom', 'male', '1985-10-11', 86);
insert into stu values(2, '马谈尹', '男', '1978-10-12', 75);
insert into stu values(3, '程余地', '女', '2000-6-12', 80);
```

### ⑪查询stu表所有学生的信息

<span style="text-decoration: underline wavy;">语法：SELECT 列名 | * FROM 表名;</span>>

```sql
select * from stu;
```

### ⑫修改stu表中所有学生的成绩，加10分特长分

<span style="text-decoration: underline wavy;">语法: UPDATE 表名 SET 列=值,列=值,列=值...[WHERE子句];</span>

```sql
update stu set score=score+10; -- mysql不支持复合运算符 score+=10 错!
```

### ⑬修改stu表中编号为1的学生成绩，将成绩改为83分。

```sql
update stu set score=83 where id=1; -- 只修改编号为1的学生的成绩
update stu set id=22, name='小老板', gender='女', birthday='1985-7-7', score=88 where id=2;
```

!!! Note "提示"
	where子句用于对记录进行筛选过滤，保留符合条件的记录，将不符合条件的记录剔除。

### ⑭删除stu表中所有的记录

<span style="text-decoration: underline wavy;">删除记录语法: DELETE FROM 表名 [where子句];</span>

仅删除符合条件的

```sql
delete from stu where id<2; -- 仅删除复合条件的记录
delete from stu; -- 没有where默认删除所有记录
```

-----

## 4️⃣单表查询

??? Tip "***准备数据： 以下练习将使用db10库中的表及表记录，请先进入db10数据库!!***"
	=== "有注释"
		```sql
		------------------------------------
		-- 创建db10库、emp表并插入记录      --
		------------------------------------

		-- 删除db10库(如果存在)
		drop database if exists db10;
		-- 重新创建db10库
		create database db10 charset utf8;
		-- 选择db10库
		use db10;

		-- 删除员工表(如果存在)
		drop table if exists emp;
		-- 创建员工表
		create table emp(
			id int primary key auto_increment,	-- 员工编号
			name varchar(50),					-- 员工姓名
			gender char(1),						-- 员工性别
			birthday date,						-- 员工生日
			dept varchar(50),					-- 所属部门
			job varchar(50),					-- 所任职位
			sal double,							-- 薪资
			bonus double						-- 奖金
		);

		-- 往员工表中插入记录
		INSERT INTO `emp` VALUES (null, '思想聚焦', '男', '1995-03-25', '计科一部', '讲师', 1800, 400);
		INSERT INTO `emp` VALUES (null, '马伊琍', '男', '1994-04-06', '计科一部', '讲师', 2500, 700);
		INSERT INTO `emp` VALUES (null, '郭艾伦', '女', '1996-06-14', '计科一部', '讲师', 1400, 400);
		INSERT INTO `emp` VALUES (null, '赵三江', '男', '1991-05-18', '计科一部', '总监', 4500, 600);
		INSERT INTO `emp` VALUES (null, '牛刘殴', '男', '1993-11-18', '计科一部', '讲师', 2600, 600);
		INSERT INTO `emp` VALUES (null, '张正', '女', '1998-07-18', '就业部', '讲师', 3700, 700);
		INSERT INTO `emp` VALUES (null, '苍蒹葭', '男', '1995-08-18', '就业部', '校长', 4850, 500);
		INSERT INTO `emp` VALUES (null, '范不找', '男', '1999-09-18', '就业部', '讲师', 3200, 700);
		INSERT INTO `emp` VALUES (null, '钱涛', '男', '1990-10-18', '就业部', '讲师', 2700, 500);
		INSERT INTO `emp` VALUES (null, '马化腾', '男', '1980-12-18', NULL, 'CEO', 5000, null);
		INSERT INTO `emp` VALUES (null, '五花马', '男', '1988-02-05', '计科一部', '讲师', 3200, 300);
		INSERT INTO `emp` VALUES (null, '李虎', '男', '1989-01-11', '计科一部', '讲师', 4200, 500);
		```
	=== "无注释"
		```sql
		drop database if exists db10;
		create database db10 charset utf8;
		use db10;

		drop table if exists emp;
		create table emp(
			id int primary key auto_increment,
			name varchar(50),
			gender char(1),
			birthday date,
			dept varchar(50),
			job varchar(50),
			sal double,
			bonus double
		);

		INSERT INTO `emp` VALUES (null, '思想聚焦', '男', '1995-03-25', '计科一部', '讲师', 1800, 400);
		INSERT INTO `emp` VALUES (null, '马伊琍', '男', '1994-04-06', '计科一部', '讲师', 2500, 700);
		INSERT INTO `emp` VALUES (null, '郭艾伦', '女', '1996-06-14', '计科一部', '讲师', 1400, 400);
		INSERT INTO `emp` VALUES (null, '赵三江', '男', '1991-05-18', '计科一部', '总监', 4500, 600);
		INSERT INTO `emp` VALUES (null, '牛刘殴', '男', '1993-11-18', '计科一部', '讲师', 2600, 600);
		INSERT INTO `emp` VALUES (null, '张正', '女', '1998-07-18', '就业部', '讲师', 3700, 700);
		INSERT INTO `emp` VALUES (null, '苍蒹葭', '男', '1995-08-18', '就业部', '校长', 4850, 500);
		INSERT INTO `emp` VALUES (null, '范不找', '男', '1999-09-18', '就业部', '讲师', 3200, 700);
		INSERT INTO `emp` VALUES (null, '钱涛', '男', '1990-10-18', '就业部', '讲师', 2700, 500);
		INSERT INTO `emp` VALUES (null, '马化腾', '男', '1980-12-18', NULL, 'CEO', 5000, null);
		INSERT INTO `emp` VALUES (null, '五花马', '男', '1988-02-05', '计科一部', '讲师', 3200, 300);
		INSERT INTO `emp` VALUES (null, '李虎', '男', '1989-01-11', '计科一部', '讲师', 4200, 500);
		```

<span class="yellow">↓↓↓基础查询↓↓↓</span>

### ⑮查询emp表中的所有员工，显示姓名，薪资，奖金

```sql
select * from emp; -- *是通配符,表示查询所有的列
select name,sal,bonus from emp; -- 查询指定的列(只会显示查询的列)
```

### ⑯查询emp表中的所有部门和职位

```sql
select dept, job from emp;-- 上面的查询结果中有很多重复的记录,如何剔除重复记录,只保留一条?
select distinct dept, job from emp;-- distinct用于去除重复记录,只保留一行!
```

<span class="yellow">↓↓↓WHERE子句查询↓↓↓</span>

### ⑰查询emp表中【薪资大于3000】的所有员工，显示员工姓名、薪资

```sql
select name,sal from emp where sal>3000;
```

### ⑱查询emp表中【总薪资(薪资+奖金)大于3500】的所有员工，显示员工姓名、总薪资

```sql
select name,sal+bonus from emp where sal+bonus > 3500;
-- null和任何数据运算结果都是null,这里应该将null值看做零来处理
```

#### 方式一: 将所有的奖金为null的列值更新为0（一般不动原数据）

```sql
update emp set bonus=0 where bonus is null;
```

#### 方式二: 在查询时将null值看做0来处理(这种方式对表中的数据不产生任何影响)
**ifnull(列名, 值)函数**: 判断指定的列是否包含null值，如果有null值，用第二个值替换null值

```sql
select name,sal+ifnull(bonus,0) from emp where sal+ifnull(bonus,0) > 3500;
```

注意查看上面查询结果中的表头，如何将表头中的 sal+bonus 修改为 "总薪资" **使用`as`可以为表头指定别名(另外as可以省略)**

```sql
select name as 姓名,sal+ifnull(bonus,0) as 总薪资 from emp 
where sal+ifnull(bonus,0) > 3500;-- as可以省略

select name 姓名,sal+ifnull(bonus,0) 总薪资 from emp where sal+ifnull(bonus,0) > 3500;
```

### ⑲查询emp表中【薪资在3000和4500之间】的员工，显示员工姓名和薪资

```sql
select name,sal from emp where sal>3000 and sal<4500;
-- and是并的意思(相当于java中的&),要求表中的记录要同时满足and两边的条件才算满足条件!
select name,sal from emp where sal>=3000 and sal<=4500;

-- 也可以使用`between 值1 and 值2` 来完成, 表示判断某个列的值是否在值1和值2之间(包含值1也包含值2)
select name,sal from emp where sal between 3000 and 4500;
```

### ⑳查询emp表中【薪资为 1400、1600、1800】的员工，显示员工姓名和薪资

```sql
select name,sal from emp where sal=1400 or sal=1600 or sal=1800;
-- sal in(1400,1600,1800),意思时只要员工的薪资等于in括号里面的任何一个值就算满足条件
select name,sal from emp where sal in(1400,1600,1800);
```

### ㉑查询薪资不为1400、1600、1800的员工，显示员工姓名和薪资

```sql
select name,sal from emp where !(sal=1400 or sal=1600 or sal=1800);
select name,sal from emp where not(sal=1400 or sal=1600 or sal=1800);
select name,sal from emp where sal not in(1400,1600,1800);
```

### ㉒(练习题) 查询emp表中薪资大于4000和薪资小于2000的员工，显示员工姓名、薪资。

??? Example "答案"
	```sql
	select name, sal from emp where sal > 4000 or sal < 2000;
	```

### ㉓(练习题) 查询emp表中薪资大于3000并且奖金小于600的员工，显示员工姓名、薪资、奖金。

??? Example "答案"
	```sql
	-- 查询结果有误差
	select name, sal, bonus from emp where sal > 3000 and bonus < 600;
	-- 对null值进行处理
	select name, sal, bonus from emp where sal > 3000 and ifnull(bonus,0) < 600;
	```

### ㉔查询没有部门的员工（即部门列为null值）

```sql
select * from emp where dept is null;
-- 判断一个列中的值是不是null不能用 = (等号), 而是用 is 判断
```

思考：如何查询有部门的员工（即部门列不为null值）

```sql
select * from emp where not(dept is null);
select * from emp where dept is not null;
```

<span class="yellow">↓↓↓模糊查询(like)↓↓↓</span>

like可以用于做模糊查询(可以按照指定的模式进行搜索),需要结合%和_使用

```sql
select * from emp where name like '王二小';
select * from emp where name='王二小';
```

!!! Info "知识点"
	在通过like进行模糊查询时,如果不配合 % 以及 _ 使用,和 = 作用相同<br>
	% : 是通配符,可以表示 <u>0个或多个任意字符</u><br>
	_ : 是通配符,只能表示 <u>1个任意字符</u>

### ㉕查询emp表中姓名中以"刘"字开头的员工，显示员工姓名。

```sql
select name from emp where name like '牛%';
-- 查询姓名列中以'牛'开头的名字, %表示'牛'的后面可以是0个或者1个或者多个任意字符
```

### ㉖查询emp表中姓名中包含"涛"字的员工，显示员工姓名。

```sql
select name from emp where name like '%刘%';
```

!!! Note "%刘%,可以匹配以下三种情况"
	1. 当第一个%匹配0个字符时,表示以'刘'开头
	2. 第二个%匹配0个字符时,表示以'刘'结尾
	3. 当前后两个%至少匹配一个字符时,包含刘在中间的某一个位置(既不在开头,也不再结尾的情况)

### ㉗查询emp表中姓名以"刘"开头，并且姓名为两个字的员工，显示员工姓名。

```sql
select name from emp where name like '刘_';
-- 刘_,可以匹配姓名中以'刘'开头,并且刘的后面只能有一个字符的情况
select name from emp where name like '刘__';
-- 刘__,可以匹配姓名中以'刘'开头,并且刘的后面只能有两个字符的情况
```

<span class="yellow">↓↓↓多行函数查询↓↓↓</span>

!!! Info "知识点"
	多行函数也叫做聚合函数(聚集函数), 常见的多行函数有(<u>多行函数会默认过滤null值,即不统计null值</u>):

	- `count(列名)`: 表示统计当前列的值有多少个(不统计null值)
	- `count(*)`: 以行为单位,统计查询结果中有多少行记录
	- `max(列名)`: 表示统计当前这一列中所有值中的最大值
	- `min(列名)`: 表示统计当前这一列中所有值中的最小值
	- `sum(列名)`: 表示统计当前这一列中所有值的和(也就是说会将这一列中所有的值加在一起返回)
	- `avg(列名)`: 表示统计当前这一列中所有值的平均值(这一列中所有值的和 / 不是null值的个数 )

### ㉘统计[emp表中薪资大于3000的员工]个数

```sql
select count(*) from emp where sal>3000;
select count(*), name from emp where sal>3000;-- 在进行统计时,不要添加额外的列,因为没有任何意义(这里的name只会将第一行的name显示出来)
```

### ㉙求emp表中的最高薪资

```sql
select max(sal) from emp;
select min(sal) from emp;
-- 在进行统计时,不要添加额外的列,因为没有任何意义(这里的name也是只会将第一行的name显示出来)
-- 这里的最高薪资和姓名没有任何关系, 薪资是所有薪资中的最大值,但name就是结果中的第一行的name
select max(sal), name from emp;
```

### ㉚统计emp表中所有员工的薪资总和(不包含奖金)

```sql
select sum(sal) from emp; -- 所有员工薪资总和
select sum(bonus) from emp; -- 所有员工奖金总和
-- 虽然bonus列中有null值,但是在通过多行函数统计时,遇到null会直接剔除,不会参与统计!
```

### ㉛统计emp表员工的平均薪资(不包含奖金)

```sql
select avg(sal) from emp; -- 所有薪资的平均值
select avg(bonus) from emp; -- 所有奖金的平均值
select sum(bonus) / count(bonus) from emp; -- 所有奖金的平均值
```

### (练习题)统计emp表员工的平均总薪资(包含奖金)

??? Example "答案"
	```sql
	-- 错!,因为马化腾的薪资(5000)加上奖金(null),结果是null,会被avg直接过滤
	select avg(sal + bonus) from emp;

	-- 错!,avg(sal)由于sal中没有null值,是总薪资/12, 而avg(bonus)由于bonus中有一个null值,是总奖金/11
	select avg(sal) + avg(bonus) from emp;

	-- 正确！先过滤在求值
	select avg(sal + ifnull(bonus,0)) from emp;
	```

***不分组使用多行函数 和 分了组使用多行函数 的区别?***

```sql
-- 如果没有分组,其实在使用count统计时会默认将整个查询结果当成一个组,
-- 这样的话,统计这一个组的人数,返回的就是一个数值;
select count(*) from emp;

-- 如果分了组(按照部门分了3组), 再使用count统计时会根据每个组来进行统计,有多少个组,
-- 就会统计出多少个结果(现有3个组,因此会统计出三个组的人数)
select count(*) from emp group by dept;

-- 如果没有分组, 再通过多行函数进行统计时, 不要显示额外的列, 
-- 因为没有任何意义(比如,上面的dept只会将第一行的dept显示出来, 和前面统计的人数没有任何关系)
select count(*), dept from emp

-- 如果分了组, 再通过多行函数进行统计时, 可以将进行分组的列和多行函数一起显示
-- 比如:按照dept分了组(分成了3组,此时每组中的dept是相同), 可以将dept这一列的值显示出来, 
-- 因为是根据这个列分的组,每组中的这个列的值也是相同的,所以显示这个组中的dept列的任意一个值都是一样的。
select count(*), dept from emp group by dept;
```

<span class="yellow">↓↓↓分组查询↓↓↓</span>

<span style="text-decoration: underline wavy;">语法：SELECT 列 | * FROM 表名 [WHERE子句] GROUP BY 列;</span>

### ㉜对emp表，按照部门对员工进行分组，查看分组后效果。

```sql
select id,name,dept from emp group by dept;
-- 如何证明上面查询的结果是三组,而不是三条记录?
-- 可以通过多行函数对分组后的数据进行统计,分成几组,就会统计出几个结果。
select count(*) from emp group by dept;
```

### ㉝对emp表按照职位进行分组，并统计每个职位的人数，显示职位和对应人数

```sql
select id,name,job from emp group by job;
```

```shell
+----+----------+------+
| id | name     | job  |
+----+----------+------+
| 10 | 马化腾   | CEO   |
|  4 | 赵三江   | 总监   |
|  7 | 苍蒹葭   | 校长   |
|  1 | 思想聚焦 | 讲师   |
+----+----------+------+
```

**显示职位和对应人数**

```sql
select count(*),job from emp group by job;
```

```shell
+----------+------+
| count(*) | job  |
+----------+------+
|        1 | CEO  |
|        1 | 总监 |
|        1 | 校长 |
|        9 | 讲师 |
+----------+------+
```

### ㉞对emp表按照部门进行分组，求每个部门的最高薪资(不包含奖金)，显示部门名称和最高薪资

```sql
select id,name,sal,dept from emp group by dept;
```

```shell
+----+----------+------+----------+
| id | name     | sal  | dept    |
+----+----------+------+----------+
| 10 | 马化腾   | 5000 | NULL     |
|  6 | 张正     | 3700 | 就业部    |
|  1 | 思想聚焦 | 1800 | 计科一部   |
+----+----------+------+----------+
```

**显示部门名称和最高薪资**

```sql
select max(sal), dept from emp group by dept;
```

```shell
+----------+----------+
| max(sal) | dept     |
+----------+----------+
|     5000 | NULL     |
|     4850 | 就业部   |
|     4500 | 计科一部 |
+----------+----------+
```

<span class="yellow">↓↓↓排序查询↓↓↓</span>

<span style="text-decoration: underline wavy;">语法：SELECT 列名 FROM 表名 [where子句] [group by 列] ORDER BY 列名 [ASC|DESC] ASC(默认)升序，即从低到高；DESC 降序，即从高到低。</span>

### ㉟对emp表中所有员工的薪资进行升序(从低到高)排序，显示员工姓名、薪资。

```sql
select name, sal from emp order by sal;     -- 默认是asc，就是升序
select name, sal from emp order by sal asc; -- 默认是asc，就是升序
```

### ㊱对emp表中所有员工的奖金进行降序(从高到低)排序，显示员工姓名、奖金。

```sql
select name, bonus from emp order by bonus desc; -- 降序必须写desc

-- 按照奖金降序排序,如果奖金相同,再按照薪资降序排序
select name, bonus, sal from emp order by bonus desc, sal desc; 
```

<span class="yellow">↓↓↓分页查询↓↓↓</span>

#### 在mysql中，通过limit进行分页查询，查询公式为:

$$ limit (页码-1) * 每页显示记录数, 每页显示记录数 $$

### ㊲查询emp表中的所有记录，分页显示：每页显示3条记录，返回所有页的数据

```sql
-- 查询emp表中的记录,每页3条,查询第1页
select * from emp limit 0, 3;
-- 查询emp表中的记录,每页3条,查询第2页
select * from emp limit 3, 3;
-- 查询emp表中的记录,每页3条,查询第3页
select * from emp limit 6, 3;
-- 查询emp表中的记录,每页3条,查询第4页
select * from emp limit 9, 3;
```

### ㊳求emp表中薪资最高的前3名员工的信息，显示姓名和薪资

```sql
-- 根据薪资降序排序(从高到低), 第一条就是薪资最高的记录
select name, sal from emp order by sal desc;
-- 在上面查询的基础上, 将第一条取出来(每页显示1条,查询第1页)
select name, sal from emp order by sal desc limit 0,1;
-- 根据薪资降序排序, 每页显示3条, 查询第一页就是薪资最高的前3名
select name, sal from emp order by sal desc limit 0,3;
```

!!! Info "<span class="yellow">↓↓↓其他函数↓↓↓</span>"
	`curdate()` -- 获取当前日期: 年月日<br>
	`curtime()` -- 获取当前时间: 时分秒<br>
	`sysdate()/now()` -- 获取当前日期+时间, 年月日 时分秒<br>
	`year('2020-8-10')`: 返回日期中的年份, 2020<br>
	`month('2020-8-10')`: 返回日期中的月份, 8<br>
	`day('2020-8-10')`: 返回日期中的天数, 10<br>
	`hour('2020-8-10 12:34:56')`: 返回时间中的小时, 12<br>
	`minute('2020-8-10 12:34:56')`: 返回时间中的分钟数, 34<br>
	`second('2020-8-10 12:34:56')`: 返回时间中的秒值, 56<br>
	
	`concat(s1,s2,...sn)`: 将 s1、s2、...sn 拼接在一起返回<br>
	例如: `name('王二小')`, `birthday('1995-03-25')`, `sal(2450)`<br>
	```sql
	select concat('王二小', '1995-03-25', 2450);
	```
	
	`concat_ws(x,s1,s2,...sn)`: <br>
	将 s1、s2、...sn 拼接在一起,并且每两个拼接时会通过x作为分隔符进行拼接,再返回<br>
	```sql
	select concat_ws(',' ,'王二小', '1995-03-25', 2450);
	```

### ㊴查询emp表中所有【在1993和1995年之间出生】的员工，显示姓名、出生日期。

```sql
-- 错误,由于birthday是日期类型(年月日格式),而1993和1995都是数值,没法比较
select name, birthday from emp where birthday between 1993 and 1995;

-- 方式一: 将1993和1995两个数值转成日期格式,再和birthday进行比较!
select name, birthday from emp where birthday between '1993-1-1' and '1995-12-31';

-- 方式二: 将birthday中的年份用year函数提取出来,再和1993以及1995进行比较
select name, birthday from emp where year(birthday) between 1993 and 1995;
```

### ㊵查询emp表中本月过生日的所有员工

```sql
-- 首先通过month函数从当前日期中获取本月是几月: month( now() )
-- 再通过month函数从员工的birthday中获取出生月份: month( birthday )
select * from emp where month( now() ) = month( birthday );
```

### ㊶查询emp表中员工的姓名和薪资（薪资格式为: xxx(元) ）

```sql
select name, concat(sal, '(元)') from emp;
```

#### 补充练习：查询emp表中员工的姓名和薪资（薪资格式为: xxx/元 ）

??? Example "答案"
	```sql
	select name, concat(sal, '/元') from emp;
	```

------

## 补充内容1: mysql的数据类型

### 1.1:数值类型

!!! Note ""
	mysql中提供了多种数值类型,其中包括: `tinyint`、`smallint`、`int`、`bigint`、`float`、`double`、`decimal`等，其中较为常用的就是 `int`、`double`

### 1.2.字符串类型

!!! Note ""
	1️⃣**`char类型`**: 定长字符串, `char(n)`, n的范围是: 0~255个字符
	<P style="text-indent:2em;">
	char类型之所以叫做定长字符串,是因为一旦确定了n的最大字符数,不管存的数据是多少,该数据占用的空间就是n个字符。
	例如：`name char(10)`, 存入'张三丰', 存入了3个字符,剩余的空间会用空格补全.
	</p>
	<P style="text-indent:2em;">
	因此<u>`char`类型可能会浪费空间!</u>
	所以 ***char类型适合存储长度固定的数据*** , 比如
	​`student_id char(11)`, 用这个列存储所有学生的编号.
	​`idcard char(18)`, 用这个列存储所有人的身份证号.
	</p>
	<P style="text-indent:2em;">
	​**char类型相比`varchar`类型速度要快一些,因为char类型只需要判断一个数据是否能存入该列中,而不需要将剩余的空间留给别的数据使用!**
	</p>

	2️⃣**`varchar类型`**: 变长字符串, `varchar(n)`, n的范围是: 0~?个字符
	<P style="text-indent:2em;">
	`varchar`类型之所以叫变长字符串,是因为n只是限制该列中最多能存的字符数, 如果你实际存的数据量小于n,
	剩余的空间还可以留给别的数据使用。例如：`name char(10),`  存入'张三丰', 存入了3个字符,剩余的7个空间会留给别的数据使用!
	因此`varchar`类型不会浪费空间!
	</p>
	<P style="text-indent:2em;">
	所以 ***varchar类型适合存储长度不固定的数据(长度固定的数据我们会使用char类型)***
	`varchar`类型最大能存的数据量是 0~65535个字节
	</p>

	3️⃣编码
	<P style="text-indent:2em;">
	`latin1`编码中,1个字符对应1个字节, n的最大值约是 65535/1 (max = 65532)<br>
	!!! Info "测试表"
		```sql
		create table t2(id int, name varchar(60000)) charset latin1;
		```
	</p>
	<P style="text-indent:2em;">
	`gbk`编码中,1个字符对应2个字节, n的最大值约是 65535/2 (max = 32766)<br>
	!!! Info "测试表"
		```sql
		create table t3(id int, name varchar(40000)) charset gbk;
		```
	</p>
	<P style="text-indent:2em;">
	`utf8`编码中,1个字符对应3个字节, n的最大值约是 65535/3 (max = 21844)
	!!! Info "测试表"
		```sql
		create table t4(id int, name varchar(20000)) charset utf8;
		```
	</p>

!!! Question "面试题: char和varchar有什么区别?"
    1. **`char`和`varchar`存的数量是不同的, char类型最多能存255个字符, `varchar`类型最多能存65535个字节**
    2. **`char`类型如果存的数据量小于最大长度, 剩余的空间会使用空格填充, 因此可能会浪费空间，所以`char`类型适合存储长度固定的数据, 这样既不会浪费空间, 效率还比`varchar`略高**
    3. **`varchar`类型如果存的数据量小于最大长度, 剩余的空间会留给别的数据使用，所以`varchar`类型适合存储长度不固定的数据, 这样虽然没有`char`存储效率高, 但至少不会浪费空间。**

### 1.3: 日期类型

!!! Note ""
	- `date`: 日期类型, 格式是: 年月日
	- `time`: 时间类型, 格式是: 时分秒
	- `datetime`: 日期+时间,格式是: 年月日 时分秒
	- `timestamp`: 时间戳, 格式和`datetime`相同, 也是: 年月日 时分秒, 和`datetime`不同的是:
    	- 1) 范围上: `datetime`范围是: 1000~9999(年份)，`timestamp`范围是: 1970到2038年
    	- 2) 实际存的数据: `datetime`实际存的就是一个`年月日 时分秒`格式的日期+时间，而`timestamp`实际存储的是这个从1970年1月1日到这个日期+时间的时间毫秒值
    	- 3) 在使用上: `timestamp`可以设置自动获取当前时间作为值插入到表中, 而`datetime`不可以.

-----

## 补充内容2: mysql的字段约束

??? Example "测试用SQL"
	```sql
	use mydb;
	drop table if exists stu;
	create table stu(
		id int primary key, -- id是主键,值不能为空且不能重复
		name varchar(50),   -- 50表示最多存50个字符
		gender varchar(10), 
		birthday date,
		score double
	);
	insert into stu value('a', '张飞', '男', '1980-1-2', 80);
	insert into stu value('b', '刘备', '男', '1981-2-2', 90);
	insert into stu value('c', '关羽', '男', '1982-3-2', 85);
	```

### 2.1: 主键约束

> 如果一个列添加了主键约束, 那么这个列的值就必须是 **非空的且不能重复**
> 主键通常用于唯一的表示一行表记录(就像人的身份证号一样)
> 一张表中通常都会有且只有一个主键

添加主键约束的格式:

```sql
create table stu(
	id int primary key,
    ...
);
```

如果id是主键并且是数值类型,为了方便维护,可以设置 **主键自增策略** ,设置方法:

```sql
create table stu(
	id int primary key auto_increment,
    ...
);
```

在设置完主键自增之后,表中会维护一个`AUTO_INCREMENT`的值,这个值从1开始,如果插入主键时没有给主键赋值,就会从`AUTO_INCREMENT`这里获取一个值再作为主键插入到表中。再用完之后，会自动将`AUTO_INCREMENT`的值加1

### 2.2: 非空约束

> 如果一个列添加了非空约束, 那么这个列的值就 **不能为空(null), 但可以重复**

添加非空约束的格式:

```sql
create table stu(
	...
	gender varchar(10) not null,
	...
);
```

### 2.3:唯一约束

> 如果一个列添加了唯一约束, 那么这个列的值就 **不能重复, 但可以为空(null)**
> 比如: 网站绑定的邮箱, 前期可以不绑定, 即可以为null, 但一旦绑定, 这个邮箱是不能和其他账号的邮箱重复的。

添加唯一约束的格式:

```sql
create table stu(
	...
	email varchar(50) unique,
	...
);
create table stu(
	...
	username varchar(50) unique not null, -- 用户名既不能重复,也不能为空
	...
);
```

!!! Note "主键约束 和 (非空+唯一约束) 有什么区别?"
	主键约束 和 非空+唯一 特点是相同的, 都是不能为空且不能重复

	主键约束除了非空且不能重复之外, 还可以表示唯一一行表记录, 即作为表记录的唯一标识。

------

## 补充内容3: mysql的外键约束

外键约束不同于主键、非空、唯一约束，外键约束是用于表示两张表的对应关系

### 1、如何保存部门(dept) 和 员工(emp)的对应关系?

 ​		可以在员工表中添加一个列(比如: `dept_id`)用于保存部门的编号, 就可以保存员工和部门的对应关系（可以将`dept_id`设置为外键, 当然也可以不这样做）

### 2、添加外键和不添加外键有什么区别？

1. 如果不添加外键：对于数据库来说，`dept_id`这个列就是一个普通的列，数据库也不会知道 dept 和 emp两张表存在任何关系，
   自然也不会帮我们去维护这层关系。假如，现在要删除dept表中的某一个部门（4号部门），
   删除后就会造成emp表中的赵六和刘能找不到部门，而赵六和刘能后面对应的`dept_id`值为4, 这个数据也变成了冗余数据。
   这样会破坏数据库中数据的完整性和一致性！
2. 如果将`dept_id`添加为外键：将`dept_id`添加为外键就等同于：通知数据库 dept 和 emp 两张表存在对应关系, 
   而且emp表中的`dept_id`列要参考dept表中的id列。这样数据库就会帮我们维护这两张表的对应关系，
   如果此时删除dept表中的某一个部门（4号部门），数据库会首先检查这个4号部门在emp表中还有没有对应的员工，
   如果有，数据库就会阻止我们删除！这样就保证了数据的完整性和一致性。如果非要删除，
   可以将4号部门里面的员工记录转移到其他部门或者删除，只要保证所删除部门中没有对应的员工即可！

------

## 补充内容4: 表关系

- <u>***1对多(多对1)***</u>: 在这种关系中,往往会在多的一方添加列,保存一的一方的主键(可以设置外键,当然也可以不设置,看需求)，比如：<br>
  		部门表(1)	员工表(*), 在员工表(*)中添加列(dept_id)保存部门的编号<br>
    	班级表(1)   学生表(*), 在学生表(*)中添加列(class_id)保存班级的编号
- <u>***1对1***</u>: 在这种关系中,可以在任意一方添加列保存另一方的主键(可以设置外键,当然也可以不设置,看需求), 比如:<br>
  		班级表(1)   教室表(1), 在班级表(1)添加列(room_id)来保存教室的编号<br>
    	班级表(1)   教室表(1), 在教室表(1)添加列(class_id)来保存班级的编号
- <u>***多对多***</u>: 在这种关系中,在任何一方添加列保存另一方的主键都不合适<br>
  		此时可以再创建一张表,在这种表中分别添加两个列(stuid,teaid), 分别用于保存学生表的主键和教师表的主键，
		以此来保存学生和教师的对应关系！

------

## 5️⃣多表查询

??? Tip "准备数据： 以下练习将使用db30库中的表及表记录，请先进入db30数据库!!!"
	=== "有注释"
		```sql
		---------------------------------------
		-- 创建db30库、dept表、emp表并插入记录 --
		---------------------------------------

		-- 删除db30库(如果存在)
		drop database if exists db30;
		-- 重新创建db30库
		create database db30 charset utf8;
		-- 选择db30库
		use db30;

		-- 删除部门表, 如果存在
		drop table if exists dept;
		-- 重新创建部门表, 要求id, name字段
		create table dept(
			id int primary key auto_increment,	-- 部门编号
			name varchar(20)					-- 部门名称
		);
		-- 往部门表中插入记录
		insert into dept values(null, '财务部');
		insert into dept values(null, '人事部');
		insert into dept values(null, '科技部');
		insert into dept values(null, '销售部');

		-- 删除员工表, 如果存在
		drop table if exists emp;
		-- 创建员工表（员工编号、员工姓名、所在部门编号）
		create table emp(
			id int primary key auto_increment,	-- 员工编号
			name varchar(20),					-- 员工姓名
			dept_id int							-- 部门编号
		);
		-- 往员工表中插入记录
		insert into emp values(null, '张三', 1);
		insert into emp values(null, '李四', 2);
		insert into emp values(null, '老王', 3);
		insert into emp values(null, '赵六', 5);
		```
	=== "无注释"
		```sql
		drop database if exists db30;
		create database db30 charset utf8;
		use db30;

		drop table if exists dept;
		create table dept(
			id int primary key auto_increment,
			name varchar(20)
		);
		insert into dept values(null, '财务部');
		insert into dept values(null, '人事部');
		insert into dept values(null, '科技部');
		insert into dept values(null, '销售部');

		drop table if exists emp;
		create table emp(
			id int primary key auto_increment,
			name varchar(20),
			dept_id int
		);
		insert into emp values(null, '张三', 1);
		insert into emp values(null, '李四', 2);
		insert into emp values(null, '老王', 3);
		insert into emp values(null, '赵六', 5);
		```

<span class="yellow">↓↓↓内连接查询↓↓↓</span>

### ㊷查询部门和部门对应的员工信息

```sql
select * from dept,emp;
```

以上查询有一个名字叫做笛卡尔积查询

!!! Info "笛卡尔积查询"
	其实就是同时查询两张表,其中一张表有m条记录,另外一张表有n条记录,查询的结果是 `m*n` 条，
	但这种查询结果中包含大量错误的数据，所以我们一般不会直接使用这种查询。
	在笛卡尔积查询的基础上，通过where子句将错误的数据剔除，只保留正确的数据，这就是 **连接查询**。

```sql
select * from dept,emp where emp.dept_id=dept.id;
```

这条是内连接查询:

```sql
select * from dept inner join emp on emp.dept_id=dept.id;
```

<span class="yellow">↓↓↓外连接查询↓↓↓</span>

### ㊸查询【所有部门】及部门对应的员工,如果某个部门下没有员工,员工显示为null

如果两张表在连接查询时,要求查询出其中一张表的所有数据,此时可以使用左外连接查询或者右外连接查询。

```sql
-- 如果要查询部门表(dept)中的所有数据,而部门表(dept)在左边,
-- 此时可以使用左外连接查询,就可以查询出所有的部门信息(而员工信息只显示和部门对应的)
select * from dept left join emp on emp.dept_id = dept.id;
```

!!! Note "左外连接查询"
	可以将左边表中的所有记录都查询出来，右边表只显示和左边相对应的数据，如果左边表中某些记录在右边没有对应的数据，右边显示为null即可。

### ㊹查询【所有员工】及员工所属部门，如果某个员工没有所属部门，部门显示为null

```sql
select * from dept right join emp on emp.dept_id=dept.id;
```

!!! Note "右外连接查询"
	可以将右边表中的所有记录都查询出来，左边表只显示和右边相对应的数据，如果右边表中某些记录在左边没有对应的数据，可以显示为null。


查询所有部门以及所有员工, 如果部门没有对应员工,可以对应null,如果员工没有对应部门,也可以对应null，这种情况应使用 <u>***全外连接查询***</u>。

但，mysql不支持全外连接查询！但可以通过`union`来模拟这种查询！
`union`关键字是用于 **将两个查询结果上下合并在一起显示，并且会去除重复记录**。
`union all`关键字是用于 **将两个查询结果上下合并在一起显示，不会去除重复记录。**
能够使用`union`和`union all`合并结果的查询语句,必须符合:

!!! Warning ""
    1. 两条SQL语句查询的结果列数必须相同
    2. 两条SQL语句查询的结果列名必须相同(低版本mysql要求)

```sql
select * from dept left join emp on emp.dept_id=dept.id
union
select * from dept right join emp on emp.dept_id=dept.id;

select * from dept left join emp on emp.dept_id=dept.id
union all
select * from dept right join emp on emp.dept_id=dept.id;
```

------

### Attention!

!!! Info "db30库中有两张表：dept和emp表，两者有外键约束"
	=== "dept表"
		```shell
		+----+--------+
		| id | name   |
		+----+--------+
		|  1 | 财务部 |
		|  2 | 人事部 |
		|  3 | 科技部 |
		|  4 | 销售部 |
		+----+--------+
		```
	=== "emp表"
		```shell
		+----+------+---------+
		| id | name | dept_id |
		+----+------+---------+
		|  1 | 张三 |       1 |
		|  2 | 李四 |       2 |
		|  3 | 老王 |       3 |
		|  4 | 赵六 |       5 |
		+----+------+---------+
		```

!!! Danger ""
	**🚫🚫🚫认真比较一下下面六个查询语句和查询结果的对应关系🚫🚫🚫**

	```sql
	select * from dept left join emp on emp.dept_id=dept.id;
	```

	```shell
	+----+--------+------+------+---------+
	| id | name  | id   | name | dept_id |
	+----+--------+------+------+---------+
	|  1 | 财务部 |    1 | 张三 |       1 |
	|  2 | 人事部 |    2 | 李四 |       2 |
	|  3 | 科技部 |    3 | 老王 |       3 |
	|  4 | 销售部 | NULL | NULL |    NULL |
	+----+--------+------+------+---------+
	```

	```sql
	select * from emp left join dept on emp.dept_id=dept.id;
	```

	```shell
	+----+------+---------+------+--------+
	| id | name | dept_id | id   | name  |
	+----+------+---------+------+--------+
	|  1 | 张三 |       1 |    1 | 财务部 |
	|  2 | 李四 |       2 |    2 | 人事部 |
	|  3 | 老王 |       3 |    3 | 科技部 |
	|  4 | 赵六 |       5 | NULL | NULL  |
	+----+------+---------+------+--------+
	```

	```sql
	select * from dept right join emp on emp.dept_id=dept.id;
	```

	```shell
	+------+--------+----+------+---------+
	| id   | name  | id | name | dept_id |
	+------+--------+----+------+---------+
	|    1 | 财务部 |  1 | 张三 |       1 |
	|    2 | 人事部 |  2 | 李四 |       2 |
	|    3 | 科技部 |  3 | 老王 |       3 |
	| NULL | NULL  |  4 | 赵六 |       5 |
	+------+--------+----+------+---------+
	```

	```sql
	select * from emp right join dept on emp.dept_id=dept.id;
	```

	```shell
	+------+------+---------+----+--------+
	| id   | name | dept_id | id | name  |
	+------+------+---------+----+--------+
	|    1 | 张三 |       1 |  1 | 财务部 |
	|    2 | 李四 |       2 |  2 | 人事部 |
	|    3 | 老王 |       3 |  3 | 科技部 |
	| NULL | NULL |    NULL |  4 | 销售部 |
	+------+------+---------+----+--------+
	```

	```sql
	select * from emp inner join dept on emp.dept_id=dept.id;
	```

	```shell
	+----+------+---------+----+--------+
	| id | name | dept_id | id | name  |
	+----+------+---------+----+--------+
	|  1 | 张三 |       1 |  1 | 财务部 |
	|  2 | 李四 |       2 |  2 | 人事部 |
	|  3 | 老王 |       3 |  3 | 科技部 |
	+----+------+---------+----+--------+
	```

	```sql
	select * from dept inner join emp on emp.dept_id=dept.id;
	```

	```shell
	+----+--------+----+------+---------+
	| id | name  | id | name | dept_id |
	+----+--------+----+------+---------+
	|  1 | 财务部 |  1 | 张三 |       1 |
	|  2 | 人事部 |  2 | 李四 |       2 |
	|  3 | 科技部 |  3 | 老王 |       3 |
	+----+--------+----+------+---------+
	```

------

??? Tip "**准备数据：以下练习将使用db40库中的表及表记录，请先进入db40数据库!!!**"
	=== "有注释"
		```sql
		-- -----------------------------------
		-- 创建db40库、dept表、emp表并插入记录
		-- -----------------------------------

		-- 删除db40库(如果存在)
		drop database if exists db40;
		-- 重新创建db40库
		create database db40 charset utf8;
		-- 选择db40库
		use db40;

		-- 创建部门表
		create table dept(				-- 创建部门表
			id int primary key,			-- 部门编号
			name varchar(50),			-- 部门名称
			loc varchar(50)				-- 部门位置
		);

		-- 创建员工表
		create table emp(				-- 创建员工表
			id int primary key,			-- 员工编号
			name varchar(50),			-- 员工姓名
			job varchar(50),			-- 职位
			topid int,					-- 直属上级
			hdate date,					-- 受雇日期
			sal int,					-- 薪资
			bonus int,					-- 奖金
			dept_id int,				-- 所在部门编号
			foreign key(dept_id) references dept(id)
		);

		-- 往部门表中插入记录
		insert into dept values ('10', '计科一部', '北京');
		insert into dept values ('20', '软科二部', '上海');
		insert into dept values ('30', '大数据部', '广州');
		insert into dept values ('40', '通信部', '深圳');

		-- 往员工表中插入记录
		insert into emp values ('1001', '王老五', '办事员', '1007', '1990-12-17', '800', 500, '20');
		insert into emp values ('1003', '李白', '分析员', '1011', '1991-02-20', '1900', '300', '10');
		insert into emp values ('1005', '杜甫', '推销员', '1011', '1991-02-22', '2450', '600', '10');
		insert into emp values ('1007', '刘青松', '经理', '1017', '1991-04-02', '3675', 700, '20');
		insert into emp values ('1009', '郭沫若', '推销员', '1011', '1991-09-28', '1250', '1400', '10');
		insert into emp values ('1011', '陈羊', '经理', '1017', '1991-05-01', '3450', 400, '10');
		insert into emp values ('1013', '红军', '办事员', '1011', '1991-06-09', '1250', 800, '10');
		insert into emp values ('1015', '钱德', '分析员', '1007', '1997-04-19', '3000', 1000, '20');
		insert into emp values ('1017', '马多云', '董事长', null, '1991-11-17', '5000', null, null);
		insert into emp values ('1019', '刘牛殴', '推销员', '1011', '1991-09-08', '1500', 500, '10');
		insert into emp values ('1021', '方不找', '办事员', '1007', '1997-05-23', '1100', 1000, '20');
		insert into emp values ('1023', '赵匡胤', '经理', '1017', '1991-12-03', '950', null, '30');
		insert into emp values ('1025', '白朴', '分析员', '1023', '1991-12-03', '3000', 600, '30');
		insert into emp values ('1027', '叶子叶', '办事员', '1023', '1992-01-23', '1300', 400, '30');
		```
	=== "无注释"
		```sql
		drop database if exists db40;
		create database db40 charset utf8;
		use db40;

		create table dept(
			id int primary key,
			name varchar(50),
			loc varchar(50)
		);

		create table emp(
			id int primary key,
			name varchar(50),
			job varchar(50),
			topid int,
			hdate date,
			sal int,
			bonus int,
			dept_id int,
			foreign key(dept_id) references dept(id)
		);

		insert into dept values ('10', '计科一部', '北京');
		insert into dept values ('20', '软科二部', '上海');
		insert into dept values ('30', '大数据部', '广州');
		insert into dept values ('40', '通信部', '深圳');

		insert into emp values ('1001', '王老五', '办事员', '1007', '1990-12-17', '800', 500, '20');
		insert into emp values ('1003', '李白', '分析员', '1011', '1991-02-20', '1900', '300', '10');
		insert into emp values ('1005', '杜甫', '推销员', '1011', '1991-02-22', '2450', '600', '10');
		insert into emp values ('1007', '刘青松', '经理', '1017', '1991-04-02', '3675', 700, '20');
		insert into emp values ('1009', '郭沫若', '推销员', '1011', '1991-09-28', '1250', '1400', '10');
		insert into emp values ('1011', '陈羊', '经理', '1017', '1991-05-01', '3450', 400, '10');
		insert into emp values ('1013', '红军', '办事员', '1011', '1991-06-09', '1250', 800, '10');
		insert into emp values ('1015', '钱德', '分析员', '1007', '1997-04-19', '3000', 1000, '20');
		insert into emp values ('1017', '马多云', '董事长', null, '1991-11-17', '5000', null, null);
		insert into emp values ('1019', '刘牛殴', '推销员', '1011', '1991-09-08', '1500', 500, '10');
		insert into emp values ('1021', '方不找', '办事员', '1007', '1997-05-23', '1100', 1000, '20');
		insert into emp values ('1023', '赵匡胤', '经理', '1017', '1991-12-03', '950', null, '30');
		insert into emp values ('1025', '白朴', '分析员', '1023', '1991-12-03', '3000', 600, '30');
		insert into emp values ('1027', '叶子叶', '办事员', '1023', '1992-01-23', '1300', 400, '30');
		```

<span class="yellow">↓↓↓子查询练习↓↓↓</span>

**将一个SQL语句的执行结果作为另外一条SQL语句的条件来执行**, 这就是子查询!

### ㊺列出薪资比'刘牛殴'的薪资高的所有员工，显示姓名、薪资

```sql
-- 求出'刘牛殴'的薪资是多少
select sal from emp where name='刘牛殴';
```

```sql
-- 求出薪资比'刘牛殴'的薪资还高的所有员工
select name, sal from emp where sal > (select sal from emp where name='刘牛殴');
```

### ㊻列出与'小老板'从事相同职位的所有员工，显示姓名、职位

```sql
-- 求出'刘牛殴'从事的职位
select job from emp where name='刘牛殴'; -- 推销员
-- 求出和'刘牛殴'具有相同职位的员工
select name, job from emp where job = (select job from emp where name='刘牛殴');
```

<span class="yellow">↓↓↓多表查询练习↓↓↓</span>

### ㊼列出在'计科一部'任职的员工，假定不知道'计科一部'的部门编号，显示部门名称，员工名称。

```sql
/*
查询的列:select dept.name, emp.name
查询的表:from dept, emp
筛选条件:where emp.dept_id=dept.id and dept.name='计科一部'
*/
SELECT dept.name, emp.name
FROM dept, emp
WHERE emp.dept_id=dept.id AND dept.name='培优部';
------------------------------------------------------
SELECT dept.name, emp.name
FROM dept INNER JOIN emp
ON emp.dept_id=dept.id
WHERE dept.name='计科一部';
```

### ㊽(❗自查询❗)列出所有员工及其直接上级，显示员工姓名、上级编号，上级姓名

```sql
/* emp e1(员工表) emp e2(上级表)
查询的列: SELECT e1.name, e1.topid, e2.name
查询的表: FROM emp e1, emp e2
筛选条件: WHERE e1.topid=e2.id
*/
SELECT e1.name, e1.topid, e2.name
FROM emp e1, emp e2
WHERE e1.topid=e2.id;
```

### ㊾列出最低薪资大于1500的各种职位，显示职位和该职位的最低薪资

​列出职位: <br>
#### 1）求出各种职位的最低薪资 先按照职位进行 **分组** ,职位相同为一组,再用 **min(sal)** 求每组中的最低薪资,也就是每种职位的最低薪资

```sql
select job, min(sal) from emp group by job;
```

#### 2）求出有哪些职位的最低薪资是大于1500的

!!! Info ""
    - `where`应在放在from子句后, `group by`子句前
    - `where`中不能使用多行函数(列别名也不能用在`where`中)
    - `where`是在分组之前之前,先过滤掉一些记录,再基于剩余的记录进行分组, 而本地是先分组,再过滤,所以不能使用`where`,应该用`having`

```sql
select job, min(sal) from emp group by job where min(sal)>1500; -- 错误写法!
select job, min(sal) from emp group by job having min(sal)>1500;-- 正确写法
```

#### 3）where和having的区别?

where和having都是用于 <u>**对表中的记录进行筛选过滤**</u>

**where用于在<u>分组之前</u>对记录进行筛选过滤,而having用于对<u>分组之后</u>的记录进行筛选过滤**

where子句中不能使用`多行函数` 和 `列别名`,但可以使用`表别名`!

having子句中可以使用`多行函数` 和 `列别名` 以及 `表别名`!

```sql
-- 其中上面的'姓名','薪资'都是列别名, e是表别名
select name as 姓名, sal as 薪资 from emp e;
```

### ㊿列出在每个部门就职的员工数量、平均工资。显示部门编号、员工数量，平均薪资。

```sql
select dept_id, count(*), avg(sal) from emp group by dept_id;
select dept_id 部门编号, count(*) 员工数量, avg(sal) 平均薪资 from emp group by dept_id;
```

### 51.列出受雇日期早于直接上级的所有员工，显示员工编号、员工姓名、部门名称、上级编号、上级姓名。

```sql
/* 
emp e1(员工表), emp e2(上级表)
查询的列:SELECT e1.id, e1.name, d.name, e2.id, e2.name
查询的表:FROM emp e1, emp e2, dept d
连接条件:WHERE e1.topid=e2.id AND e1.dept_id=d.id
筛选条件:AND e1.hdate < e2.hdate
*/
SELECT e1.id, e1.name, d.name, e2.id, e2.name
FROM emp e1, emp e2, dept d
WHERE e1.topid=e2.id
AND e1.dept_id=d.id
AND e1.hdate < e2.hdate;
```

------

## 补充内容5: set names gbk;

```sql
set names gbk;
```

!!! Note ""
	(这个命令是用在cmd窗口中)用来通知数据库服务器, 当前cmd窗口发送给服务器的数据的GBK的,那么服务器就会按照GBK编码来接收 cmd窗口发送过来的数据, 再将GBK的数据转换成utf8编码的数据存入数据库中!<br>
	这个命令只能用在cmd窗口! 而且是每次新开一个cmd窗口都需要重新设置一次!<br>
	像Navicat/SQLYog等工具不需要设置该命令,因为这些工具底层已经设置过编码了!

------

## 补充内容6: 数据库的备份和恢复

<span class="yellow">↓↓↓备份数据库↓↓↓</span>

### ①备份单个数据库

在cmd窗口（未登录、未连接到mysql服务器的界面）中，可以通过如下命令对指定的数据库进行备份：

```powershell
mysqldump -u用户名 -p密码 库名 > 备份文件的位置
```

**示例1**: 对db40库中的数据(表,表记录)进行备份,备份到 d:/db40.sql 文件中

```powershell
mysqldump -uroot -proot db40 > d:/db40.sql
```

### ②备份多个数据库（比如备份两个数据库）

在cmd窗口中(已登录的状态下)，可以通过`source`命令来执行指定位置的sql文件中的sql语句：
```powershell
source "sql文件的位置"
```

**示例2**: 将 d:/db40.sql 文件中的数据恢复到 db80 库中

1) 先创建db80库, 并进入到db80库

```powershell
create database db80 charset utf8;
use db80;
```

2) 再通过source命令执行 d:/db40.sql 文件中的sql语句

```powershell
source d:/db40.sql
```

------

# 三、JDBC

### 1.1  什么是JDBC

JDBC(Java DataBase Connectivity) Java数据库连接<br>
其实就是利用Java语言(Java程序)连接并访问数据库的一门技术

### 1.2  为什么要学习JDBC

之前我们可以通过 CMD窗口 或者 通过 Navicat/Sqlyog等软件 连接数据库, 对数据库中的数据进行增删改查操作.<br>
但是,将来我们在企业开发中,更多的是通过程序来连接数据库, 而我们学的是Java开发,通过Java程序连接数据就必须用到JDBC这门技术!<br>
像 `Mybatis/hibernate/DBUtils/Spring JdbcTemplate` 等框架底层也是在通过JDBC来连接数据库


### 1.3  如何通过JDBC连接数据库

#### 概述

1. 早期, 不同的数据库厂商提供的 **数据库驱动包** (jar)是各不相同, 开发人员在操作不同 的数据库时需要学习该数据库对应的数据库驱动(jar)包, 这对于开发人员的学习成本太高了!
2. 后来SUN公司就规定了JDBC这套规范(其实其中包含了大量的接口), 要求不同的数据库厂商提供的驱动都来实现这套接口, 这样一来, 开发人员只需要学会这套接口, 所有的数据库就都会操作了!
3. JDBC中主要包含两个包(java.sql和javax.sql), 并且java中已经包含这两个包了,但除了JDBC的包之外, 我们在操作数据库时还需要导入该数据库对应的驱动包(jar包)

### 1.4 JDBC快速入门案例

#### 1、准备所需要的数据库、表、表记录

```sql
drop database if exists db_demo;
create database db_demo charset utf8;
use db_demo;
create table account(
	id int primary key auto_increment,
	name varchar(50),
	money double
);
insert into account values(null, 'tom', 1000);
insert into account values(null, 'andy', 1000);
insert into account values(null, 'tony', 1000);
```

#### 2、导入mysql驱动包([mysql-connector-java-8.0.11.jar](https://www.softpedia.com/get/Internet/Servers/Database-Utils/MySQL-Connector-J.shtml#download))

找到 `mysql-connector-java-8.0.11.jar` 文件 并复制，将这个文件复制到项目/lib目录下, 注意,这里只是将jar文件复制过来了，但并没有添加到项目中, 所有程序中还是无法使用这个jar包，还需要在当前项目中引用这个jar包(IDEA和Eclipse操作不一，可以自行百度)

#### 3、创建`com.example.JdbcDemo`类,在这个类中通过六个步骤完成连接数据库操作

```java
/**
* JDBC的快速入门程序
* 	查询jt_db库中account表中的所有记录
* 	select * from account;
*/
public class JdbcDemo1 {
	public static void main(String[] args) throws Exception {
		//1.注册数据库驱动(可以省略,但建议加上)
		Class.forName( "com.mysql.cj.jdbc.Driver" );
		//2.获取数据库连接
		/*
		Connection conn = DriverManager.getConnection(
			"jdbc:mysql://localhost:3306/db_demo?characterEncoding=utf-	 8&serverTimezone=Asia/Shanghai", "root", "root"); */
		Connection conn = DriverManager.getConnection(
				"jdbc:mysql:///db_demo?characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=false", "root", "root");

		//3.获取传输器
		Statement stat = conn.createStatement();
		//4.发送sql到数据库执行,并返回执行结果
		ResultSet rs = stat.executeQuery( "select * from account" );

		System.out.println( rs );

		//5.处理结果(将查询的结果一行行输出到控制台)
		//rs.next 返回true表示下一行有数据, 就会进入循环获取下一行数据
		while( rs.next() ) { 
			int id = rs.getInt( "id" );
			String name = rs.getString( "name" );
			double money = rs.getDouble( "money" );
			System.out.println( id+","+name+","+money );
		}
		//6.释放资源(越晚获取的越先关闭)
		rs.close();
		stat.close();
		conn.close();
	}
}
```

#### 4、如何通过JDBC增删改数据

```java
/* 新增表记录: 往account表中添加一条记录: null 'hellen' 3500 */
	@Test
	public void testAdd() throws Exception {
		//注册驱动
		Class.forName( "com.mysql.cj.jdbc.Driver" );
		//获取连接
		Connection conn = DriverManager.getConnection( 
			"jdbc:mysql:///db_demo?characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=false", 
			"root", "root" );
		//获取传输器
		Statement stat = conn.createStatement();
		//执行SQL语句, 返回执行结果
		String sql = "insert into account value(null, 'hellen', 3500 )";
		int rows = stat.executeUpdate(sql); 
		//处理结果
		System.out.println( "影响的行数为: "+rows );
		//释放资源
		stat.close();
		conn.close();
	}
	--------------------------------------------
	/* 修改: 将name为'hellen'的金额修改为5000 */
	@Test
	public void testUpdate() {
		
	}
	--------------------------------------------
	/* 修改: 将name为'tom'的记录删除! */
	@Test
	public void testDelete() {
		
	}
```

#### 5、JDBC连接数据库的优点和缺点

1. 优点：使用`JDBC`连接并访问数据库 相比使用第三方的框架连接访问数据库速度要快一些!因为这是最为传统,最为底层的方法。
2. 缺点:
    - `JDBC`中包含大量重复的代码(比如每次连接数据库都需要 注册驱动、获取连接、获取传输器、处理结果、释放资源等)，后期难以维护
    - `JDBC`自身没有连接池，而框架（`mybatis`自带连接池）自带连接池，当需要连接直接从连接池中获取，用完连接不用关闭，再还回连接池中，这样可以提高执行效率！
    - `JDBC`中执行`select`查询语句的结果需要开发人员自己手动处理, 如果是非常复杂的数据(比如查询的结果中列数非常多或者查询的数据来自多张表)处理起来是非常麻烦的,但框架可以帮我们处理!

#### 6、连接池概念

- 如果不使用连接池: 
   		用户每次需要连接访问数据库时, 都需要创建一个连接(Connection), 基于这个连接去访问数据库中的数据, 用完连接(Connection)后会将连接关闭(close), 其实每次创建连接和关闭连接(相比使用连接)需要消耗大量的时间和资源,导致程序的执行效率低下(特别是高并发的时候,比如京东618)
- 如果使用连接池:
   		可以在程序一启动之后,就创建一批连接放在一个池中(容器), 当用户需要连接时, 不用自己创建, 而是从连接池中获取一个连接对象, 再基于这个连接对象去访问数据库, 用完连接后, 不用将连接关闭, 而是还回连接池中。这样一来，用户使用的都是池中的这一批连接，可以减少连接创建和关闭的次数，提高程序的执行效率！

### 1.5:数据库事务

#### 1、什么是事务

**DataBase Transaction(数据库事务)**
简单的说: 事务就是将一堆的SQL语句绑定在一起执行, 执行结果是: 所有SQL都执行成功了才算成功, 但凡有一条失败, 就按全失败来处理（比如即使执行成功的语句，也会进行回滚，就是撤销当前的执行）。

```sql
开启事务
insert into account(null, 'aaa', 2000);
update account set money = money+100;
...
关闭事务(提交/回滚)
```

以转账为例: A、B账户各有1000元，A给B转账100元
	A账户减去100元：

```sql
update account set money=money-100 where name='A';
```

B账户加上100元：

```sql
update account set money=money+100 where name='B';
```

如果上面两条语句执行时,没有事务,如果第一条成功,但第二条失败了!
反之,如果第一条失败了,但第二条成功了!
所以如果想保证上面的两条SQL语句同时成功或者同时失败,可以将这两条SQL添加到一个`事务`中。

#### 2、事务的四大特征(面试题)

!!! Note ""
    - <u>**原子性**</u>：原子曾被认为是最小单位，不能被分割, 这里的原子性其实是指：事务中的所有SQL是一个整体，不能被分割。不存在一部分SQL执行成功，而另一部分SQL执行失败，都执行成功才算成功，有一条失败就算失败！
    - <u>**一致性**</u>：在事务执行前后(不管事务最后是提交还是回滚)的业务数据之和是保持一致的!
      ```sql
      -- 以转账为例: A、B账户各有1000元，A给B转账100元
      -- A账户减去100元：
      update account set money=money-100 where name='A';
      -- B账户加上100元：
      update account set money=money+100 where name='B';
      -- 如果上面的SQL是在一个事务中执行的, 可以保证A和B的账户金额之和在转账前、转账后是一致的！
      ```

    - <u>**隔离性**</u>：在事务并发时, 一个事务理论上看不到另外一个事务的状态, 也就是说事务之间是相互隔离开来的!
    ```sql
    -- 一个事务只能看到另外一个事务没开始之前的数据状态, 或者只能看到另外一个事务已经结束之后的数据状态!
    事务1--开启事务, 查询A+B的账户金额之和
    A+B账户金额之和: 2000
    事务2--开启事务, 完成一个转账操作(A给B转账100元)
    A减去100元=900
    --------------
    B加上100元=1100
    ```

    - <u>**持久性**</u>：一旦事务提交之后, 事务中对数据的更新操作会持久的保存到数据库中(最终是更新到硬盘的数据文件里)。反过来说, 在事务提交之前, 对数据的更新操作只是一个临时的数据, 没有真正的去修改数据库。
      ```sql
      -- 开启事务:
      -- A减去100元: 
      update account set money=money-100 where name='A'; 900元
      -- B加上100元: 
      update account set money=money+100 where name='B'; 1100元
      -- 结束事务(提交,回滚)
      ```

![end](../../assets/images/end.png)

-----