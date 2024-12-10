---
title: MySQL的功能语句
description: MySQL的功能语句
---

## MySQL的互斥锁

MySQL有时候需要互斥锁用于防止出现数据安全问题，可以使用互斥锁 ，也就是悲观锁，这个语句是行锁，会锁住你选中的那一行数据，
直到你提交事务(一般都是自动提交)，使用的时候需要注意事务的隔离级别，不然也可能会出现脏独可能，还有要注意死锁，
虽然MySQL会提供死锁检测，最好可以设置一下 `innodb_lock_wait_timeout` 锁超时时间。

MySQL提供的互斥锁之间是不能共存的，就是你锁住的行，只有等锁持有者释放才可以再次拥有。类比`synchronized`。

```sql
select title from t_topic where id='asdaf123' for update;
```

## MySQL的共享锁

MySQL的共享锁是一种读写锁，你可以让线程并发的读取数据，但是你要修改数据就不能并发执行，提交事务后才能修改成功。
这意味着多个事务之间可以同时持有共享锁，互相不排斥。类比`ReentrantReadWriteLock`。

```sql
select title from t_topic where id='asdaf123' lock in share mode;
```

## MySQL中存储引擎的状态

一般MySQL用的都是`INNODB`，我目前是没有见过也没有听过使用其他存储引擎的。有时候需要看一看线上数据库的状态，
排查死锁了，看事务的状态，一些日志，缓冲区等，都可以用这个命令。

```sql
SHOW ENGINE INNODB STATUS;
```

## MySQL慢查询日志

有时候线上发现接口执行很慢，排查后发现是SQL语句很慢，可以看看慢查询日志辅助定位。

```sql
SHOW VARIABLES LIKE '%slow_query_log%';
```

执行后一般会有一些输出，有些项开启为`ON`，如 

- `slow_query_log`表示是否启用看慢查询日志。
- `slow_query_log_file`表示慢查询日志文件的路径和名称，存放在MySQL的数据目录中，但你可以根据需要自定义路径和文件名。
    使用`SHOW VARIABLES LIKE 'datadir';`语句可以查看路径地址。
- `long_query_time`表示“慢查询”的时间阈值（单位为秒），默认是10秒。
- `log_slow_admin_statements`表示是否记录管理类的慢查询。就是一些 ALTER TABLE、CREATE INDEX 等DDL（数据定义语言）操作。
- `log_queries_not_using_indexes`表示是否记录那些没有使用索引的查询。这类查询可能会导致全表扫描，影响性能。
- `slow_launch_time`表示一个线程被认为是“慢启动”的时间阈值（单位为秒），默认是2秒。

一般永久开启需要修改 `my.cnf` 或 `my.ini`文件

```properties
[mysqld]
slow_query_log = 1
slow_query_log_file = /path/to/slow-query.log
long_query_time = 1
...
```

## MySQL的一些变量含义
### wait_timeout
非交互式客户端(Java Web的连接等)连接在空闲状态下可以保持多久不活动，之后服务器会自动关闭该连接。单位是秒。默认28800秒（8小时）。

```sql
SHOW GLOBAL VARIABLES LIKE 'wait_timeout';
```

### interactive_timeout
交互式客户端(如命令行工具、开发环境、CMD)连接在空闲状态下可以保持多久不活动，之后服务器会自动关闭该连接。单位是秒。默认28800秒（8小时）。

```sql
SHOW GLOBAL VARIABLES LIKE 'interactive_timeout';
```

### max_connections
表示MySQL服务器允许的最大并发连接数。当连接数达到这个限制时，新的连接请求将被拒绝，并返回“`Too many connections`”错误。默认151

```sql
SHOW GLOBAL VARIABLES LIKE 'max_connections';
```

### Threads_connected
表示当前有多少个客户端连接正在与MySQL服务器通信。这个值包括所有活跃的和空闲的连接。

```sql
SHOW GLOBAL STATUS LIKE 'Threads_connected';
```

