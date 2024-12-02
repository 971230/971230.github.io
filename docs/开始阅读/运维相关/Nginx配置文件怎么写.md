---
title: Nginx配置文件怎么写
description: Nginx配置文件怎么写
---

# Nginx配置文件怎么写

!!! Note ""
    只是个人的一些运维经验，牵涉的东西不是那么全面，完整，这个东西一般还是要自己不停测试才知道到底配置是怎么运作的，
    才容易有一个清晰的概念，不然容易停留在知道而非理解的阶段。

## 介绍

Nginx("engine x")就是一个服务器反响代理的工具，因为性能好，占用小，负载均衡能力强，被广泛使用，这东西截至写文前已经20年了，
是俄罗斯老哥Igor Sysoev写的。

<a href="https://nginx.org" target="_blank">
<button class="link_button">
    官网
</button>
</a>

## 反向代理

其实就是一句话，正向代理代理客户端，反向代理代理服务器，正向代理如VPN，反向代理就是Nginx了。[^1]
[^1]: 参考帖子:(https://cloud.tencent.com/developer/article/1418457)


## 启动、关闭和重启服务等常用命令

一般默认安装的Nginx，如Ubuntu使用命令 `apt-get install nginx` ，安装好就是开启状态，直接访问本机IP,这种方式的好处是一键安装，
按时我踩了一个坑，就是默认安装的nginx，分布在系统的各个模块，没有upstream，nginx就用不了，但是实测其他功能是好的。

会出现如下画面：

![图片的样式](./img/nginx.png)

没有启动可以使用命令 `systemctl start nginx` 启动，如果你是官网下载的，则需要自己编译configure文件，下载好相应的依赖库编译安装好后，
执行主目录下的 `./sbin/nginx` 就可以启动，但是这个很麻烦，我自己不熟悉这块，有bug要百度。

=== "启动"

    ``` shell
    systemctl start nginx
    ```

=== "安全关闭"

    ``` shell
    nginx -s quit
    ```

=== "快速关闭"

    ``` shell
    nginx -s stop
    ```

=== "重载配置"

    ``` shell
    nginx -s reload
    ```

=== "检查配置文件"

    ``` shell
    nginx -t
    ```

=== "重新打开日志文件"

    ``` shell
    nginx -s reopen
    ```

当然你要关闭服务也可以直接 `ps -ef | grep nginx` 找出进程号， `kill -s QUIT 进程号`，也是一样的。

## 配置文件结构

Nginx的配置文件结构大致有5种，全局块配置和其他四种块配置

```properties
# 1️⃣全局块
user www-data;
# 2️⃣event块 
events {
}
# 3️⃣HTTP块
http {
    # 4️⃣服务块
    server {
    }
    # 5️⃣stream块配置
    stream {
    }
}
```

一般只是简单的单体项目，配个静态的前端页面，只需要指定一下页面位置和代理的端口，就可以直接通过端口访问到了：

```properties
http {
    server {
        # 拦截的端口号
        listen       80;
        # 访问的地址
        server_name  localhost;
        
        # 访问的后缀和页面文件
        location / {
            # 页面文件地址
            root   html;
            # 页面文件名
            index  index.html index.htm;
        }
    }
}
```

### 全局块配置项

单独配置项有很多，这里只写一部分，全部的还是要去官网看看，这些配置都要根据需要开启。它包含了影响整个Nginx服务器运行的基本指令，
适用于所有的工作进程以及后续定义的所有其他配置块。

```properties
# 指定Nginx运行的用户为www-data，提高安全性
user www-data;
# 定义Nginx启动时CPU核心数设置工作进程数
worker_processes 4;
# 指定Nginx主进程PID文件的路径
pid /run/nginx.pid;
# 控制是否启用主进程模式。默认情况下，Nginx会启动一个主进程来管理多个工作进程。
# 如果关闭了这个选项，则Nginx将以单个工作进程的方式运行
master_process on;
# 指定Nginx是否以守护进程的形式运行
daemon on;
# 动态加载模块，这个基本默认就能满足需求，很少有自己加载的
load_module modules/ngx_http_perl_module.so;
# 设置环境变量，这些变量可以在Nginx内部使用或者传递给子进程
env MY_ENV_VAR;
# 定义锁文件的位置，主要用于防止多个实例同时启动时发生冲突
lock_file /var/lock/nginx.lock;
# 设置每个工作进程打开文件描述符的最大数量
worker_rlimit_nofile 10240;
```

### events块配置

这个块是专门用于管理和配置Nginx服务器与客户端之间的网络连接。通过调整events块中的参数，可以显著影响Nginx处理并发连接的能力和效率。
一般的设置只用到worker_connections，要用到其他的设置都是属于比较深层次的调整，要针对具体的系统“个性化”设置，不是说你添加了就好的，
甚至适得其反，完全不如不加。

```properties
events {
    # 每个工作进程允许的最大连接数，和全局块里面的工作进程数配合
    # 增加可以提升并发能力，过高系统CPU磁盘又不一定扛得住，要实测才知道你的机子到底多少合适。
    # 也可以根据自己以往的经验先设置一个，在实测调整。
    worker_connections 1024;

    # 指定Nginx使用的事件模型，选择合适的模型可以提升性能
    use epoll;

    # 控制是否允许单个工作进程一次性接受多个新连接，
    # 当设置为on时，Nginx可以在接收到新的连接请求时，尽可能多地接受这些连接；而设置为off时，则每次只接受一个新连接。
    # 开启此功能可以在高并发情况下提高连接处理的速度，但也可能增加系统的负担
    multi_accept on;

    # 决定是否启用接受互斥锁机制。当多个工作进程竞争同一个新连接时，
    # 启用accept_mutex可以确保只有一个进程会获得这个连接，从而避免“惊群”问题。
    accept_mutex on;
    # 当accept_mutex被启用时，如果当前持有互斥锁的工作进程未能及时处理新的连接请求，
    # 其他等待的工作进程将延迟一段时间后再尝试获取锁。
    accept_mutex_delay 50ms;

    # 用于指定哪些客户端的连接应该启用调试模式。
    debug_connection 192.168.1.1;

    # 设置每个工作进程异步I/O请求的最大数量。对于需要大量进行磁盘I/O操作的应用来说，适当调整这个参数可能会带来性能上的改善。
    worker_aio_requests 32;

    # 设定工作进程的调度优先级。较低的数值表示更高的优先级。
    worker_priority -5;

    # 将工作进程绑定到特定的CPU核心上运行，以减少上下文切换带来的开销，并提高缓存命中率。
    worker_cpu_affinity 0001 0010 0100 1000;
}
```

### http块配置

这个块就是负责具体的反向代理和负载均衡的工作，设置很多，存在较多的细节，尽量讲清楚。

```properties
#--------------------------------- 1️⃣MIME类型配置 -------------------------------
# 引入支持的文件类型定义文件，确保Nginx能够正确识别并处理不同类型的文件。
# 一般都是要添加的，文件在哪个路径就设置在哪，有些系统不一定放在和配置文件的同目录下，要自己找找。
include mime.types;

# 设置默认的MIME类型，当Nginx无法确定请求资源的具体类型时会使用此值。
default_type application/octet-stream;

#----------------------------------- 2️⃣日志配置 ---------------------------------
# 定义日志格式，允许自定义访问日志的内容，可以按照需要自己拼接自己设置。
# $remote_addr: 客户端的IP地址。
# $time_local: 本地时间。
# $protocol: 协议类型（TCP或UDP）。
# $status: 连接状态。
# $bytes_sent: 发送给客户端的字节数。
# $bytes_received: 从客户端接收的字节数。
# $session_time: 会话持续时间。
# $upstream_addr: 上游服务器的地址。
# $upstream_bytes_sent: 发送给上游服务器的字节数。
# $upstream_bytes_received: 从上游服务器接收的字节数。
# $upstream_connect_time: 与上游服务器建立连接所花费的时间。
log_format proxy 
	'$remote_addr [$time_local] ' 
	'$protocol $status $bytes_sent $bytes_received ' 
	'$session_time "$upstream_addr" ' 
	'"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';

# 指定访问日志的存放位置及使用的日志格式。
access_log /var/log/nginx/access.log main;
# 配置错误日志的位置及记录级别。适当的日志记录可以帮助管理员监控Nginx的状态并及时发现潜在问题。
error_log /var/log/nginx/error.log warn;

#----------------------------------- 3️⃣性能优化 ---------------------------------
# 控制是否启用sendfile系统调用，以提高静态文件传输效率，这个一般都开启。
sendfile on;
# 在发送HTTP响应头之后立即关闭TCP的Nagle算法，减少延迟。
tcp_nopush on;
# 禁用TCP延迟确认，确保数据包尽快发送。
tcp_nodelay on;
# 设置保持连接的时间，以复用已建立的连接，减少TCP三次握手的开销，单位秒。
keepalive_timeout 65;
# 定义客户端请求头部的最大缓冲区大小，防止过大的请求头部导致服务拒绝。
client_header_buffer_size 1k;
# 设置用于存储大请求头部的缓冲区数量和大小。
large_client_header_buffers 4 8k;
# 限制客户端请求体的最大尺寸，避免上传过大文件占用过多资源，这个一般还是在自己应用内部做控制，不交于Nginx负责。
client_max_body_size 10m;
# 开启或关闭Gzip压缩，减少传输的数据量，这个一般都是开启的。
gzip on;
# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;
# gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
gzip_comp_level 6;
# 设置压缩所需要的缓冲区大小
gzip_buffers 16 8k;
# 设置gzip压缩针对的HTTP协议版本
gzip_http_version 1.1;
# 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
gzip_min_length 1k;
# 指定哪些MIME类型的数据应该被压缩。
gzip_types text/plain text/css application/json application/javascript;

# 下面的配置需要搭建FastCGI服务器
# 设置FastCGI服务器地址
fastcgi_pass   127.0.0.1:9000;
# 设置FastCGI服务器访问入口文件
fastcgi_index  index.html;
# 定义一个FastCGI环境变量，并为其赋值。FastCGI环境变量是传递给FastCGI服务器的参数，用于控制脚本的执行环境。
fastcgi_param  SCRIPT_FILENAME  /home/www/html$fastcgi_script_name;
# 设置Nginx与FastCGI服务器建立连接的超时时间。
fastcgi_connect_timeout 300;
# 设置Nginx向FastCGI服务器发送请求数据的超时时间。
fastcgi_send_timeout 300;
# 设置Nginx从FastCGI服务器读取响应数据的超时时间。
fastcgi_read_timeout 300;
# 设置用于读取FastCGI响应的第一个部分的缓冲区大小。
fastcgi_buffer_size 64k;
# 设置用于读取FastCGI响应的缓冲区数量和每个缓冲区的大小。
fastcgi_buffers 4 64k;
# 设置在响应数据尚未完全读取时，Nginx可以使用的最大缓冲区大小。
fastcgi_busy_buffers_size 128k;
# 设置当FastCGI响应数据被写入临时文件时的最大写入大小。
fastcgi_temp_file_write_size 128k;

#----------------------------------- 5️⃣其他设置 ---------------------------------
# 引入外部配置文件，使得主配置文件更加简洁明了，一般设置不多，也就写在一个文件里面。
include /etc/nginx/conf.d/*.conf;
# 控制是否在响应头中显示Nginx版本信息，有助于提高安全性。
server_tokens off;
# 启用或禁用目录列表功能，当请求指向一个目录而不是具体的文件时，Nginx将列出该目录下的所有文件。一般为了安全不开
autoindex on;
# 文件大小以人类可读格式显示
autoindex_exact_size off;
# 显示本地时间
autoindex_localtime on
# 向HTTP响应头中添加自定义字段，可用于传递额外的信息给客户端。
add_header X-Frame-Options SAMEORIGIN;
# 实现URL重写，根据规则修改请求的URL。
rewrite ^/old/(.*)$ /new/$1 permanent;
# 限制请求速率，防止某些客户端过度占用资源。
limit_req zone=mylimit burst=5;
# 限制单个客户端的最大并发连接数，保护服务器免受过多连接的影响。
limit_conn addr 10;

#----------------------------------- 6️⃣缓存配置 ---------------------------------
# 定义缓存存储的位置及相关参数。
proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
# 指定使用哪个缓存区域。
proxy_cache my_cache;
# 设置缓存的有效时间。
proxy_cache_valid 200 302 10m;
# 定义用于生成缓存键的表达式。
proxy_cache_key "$scheme$request_method$host$request_uri";

#----------------------------------- 7️⃣安全配置 ---------------------------------
# 配置SSL证书和私钥文件的位置，用于启用HTTPS。
ssl_certificate /etc/nginx/ssl/example.com.crt;
ssl_certificate_key /etc/nginx/ssl/example.com.key;
# 设置允许的SSL协议版本和加密套件，确保通信的安全性。
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
# 强制浏览器仅通过HTTPS访问网站，提升安全性。
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

#----------------------------------- 8️⃣限流配置 ---------------------------------
# 一般和server块配合使用
# 限制请求数：定义一个名为 one 的速率限制区，使用 $binary_remote_addr 变量（即客户端IP地址）作为键。
# 区域大小为 10m，意味着可以存储大约 160,000 个状态（10 MB / 64 bytes per state）。
# 速率限制为每秒10个请求 (burst=20) 允许突发流量达到20个请求，同时 nodelay 参数表示不延迟处理这些额外的请求。
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

# 限制连接数：定义了一个名为 addr 的共享内存区域，用来存储连接状态信息
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    listen 80;
    server_name example.com;

    location / {
        # 应用上面定义的 'one' 限流区
        limit_req zone=one burst=20 nodelay;
        # Nginx 对于每个由 limit_conn_zone 定义的 addr 区域中的键（即每个客户端IP地址），
        # 最多允许同时存在 10 个并发连接
        limit_conn addr 10;
        # 设置读取客户端请求体（body）时的超时时间，适用于上传文件、提交表单等场景
        client_body_timeout 5s;
        # 定义读取客户端请求头（headers）时的超时时间，适用于所有类型的HTTP请求
        client_header_timeout 5s;
        # 拒绝来自固定IP的请求
        deny 123.123.123.3;
        # 允许来自固定IP的请求
        allow 192.168.1.0;
        proxy_pass http://localhost;
    }
}
```

### server块配置
server块主要用于定义虚拟主机（Virtual Host），即针对特定域名或IP地址和端口组合的服务配置。
通过server块，可以实现同一台服务器上托管多个网站或应用的功能。要写到HTTP模块里面不能独立。

先单独写一下server里面Nginx的官方文档中定义的location的语法结构：

```
location [ = | ~ | ~* | ^~ ] uri { ... }
```

uri变量是待匹配的请求字符串，可以是不含正则表达的字符串，如/index.html等[^2]
[^2]:https://www.cnblogs.com/54chensongxia/p/12938929.html

!!! Note ""
    - “=”，用于标准uri前，要求请求字符串与uri严格匹配。如果已经匹配成功，就停止继续向下搜索并立即处理此请求。
    - “^～”，用于标准uri前，要求Nginx服务器找到标识uri和请求字符串匹配度最高的location后，立即使用此location处理请求，
        而不再使用location块中的正则uri和请求字符串做匹配。
    - “～”，用于表示uri包含正则表达式，并且区分大小写。
    - “～*”，用于表示uri包含正则表达式，并且不区分大小写。注意如果uri包含正则表达式，就必须要使用“～”或者“～*”标识。

```properties
listen 80;  # 监听所有IP地址的80端口
listen 192.168.1.1:80;  # 仅监听指定IP地址的80端口
listen [::]:80 ipv6only=on;  # 仅监听IPv6地址的80端口

# 定义了Nginx用来匹配HTTP请求中Host头字段的值，从而确定哪个server块应该处理该请求。
# 它可以是一个具体的域名、通配符或正则表达式。
server_name localhost
server_name example.com www.example.com;
server_name *.example.com;  # 匹配所有子域名
server_name ~^(www\.)?(?<domain>.+)$;  # 使用正则表达式捕获域名部分

# 设置响应内容的字符编码，确保浏览器能够正确解析页面内容。
charset utf-8;
# 指定Web服务器的根目录，即文档树的起点。
root /var/www/html;
# 定义默认的索引文件列表，当用户访问一个目录时，Nginx会依次尝试加载这些文件。
index index.html index.htm index.php;

# 匹配静态文件后缀，用于开启静态文件可以一直缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires max;
}

# location块用于匹配URL路径，并为匹配到的请求提供专门的处理逻辑。
# 它可以基于精确匹配、前缀匹配、正则表达式匹配等方式工作。
# 精确匹配根路径，如果访问localhost:80(或localhost:80/index.html)，就展示/etc/nginx/web下index.html页面
location / { 
    root /etc/nginx/web;
    index index.html index.htm;
    # 按顺序一个个匹配找
    try_files $uri $uri/ /index.html;
}

# 将请求localhost:80/api/的请求都转发到localhost:1234
location /api/ {
    proxy_pass localhost:1234;
}

# 与root指令不同的是，alias不会将请求的URI附加到指定路径之后，而是直接指向你提供的完整路径
# 在使用alias时，确保alias路径和location路径都以斜杠结尾，或者都不以斜杠结尾。
# 确保Nginx进程有权限访问你指定的alias路径
# ⚠️⚠️⚠️使用alias时要注意不要暴露不应该公开的文件或目录
location /downloads/ {
    alias /var/www/downloads/;
}

# rewrite 用于实现URL重写、重定向等操作，如下面将 /old-page 重写为 /new-page
server {
    listen 80;
    server_name example.com;

    location /old-page {
        rewrite ^/old-page$ /new-page permanent;
    }

    location /new-page {
        # 处理新页面的逻辑
    }
}
```

### stream块配置

stream块是用于配置TCP和UDP代理服务的部分，这个要写到HTTP模块里面

```properties
# 定义上游服务器集群，用于反向代理和负载均衡。可以包含多个服务器，并支持多种负载均衡算法。
upstream backend {
    server 192.168.0.1:25;
    server 192.168.0.2:25;
    ...
}
```

然后你写一个如下配置，就可以将访问localhost:4567的请求，分给backend集群：

```properties
server {
    listen 4567;
    proxy_pass backend;
}
```

也可以这样写，里面还有一些配置项，也是很重要的一个，用于请求的相关设置

```properties
server {
    listen 4567;
    location ~* ^/(code|auth|weixin|api) {
        # 将请求代理到backend
        proxy_pass backend;
        # 设置Host头为原始请求的Host
        proxy_set_header Host $http_host;
        # 设置与后端的连接超时时间为15秒
        proxy_connect_timeout 3s;
        # 设置向后端发送请求的超时时间为15秒
        proxy_send_timeout 3s;
        # 设置从后端读取响应的超时时间为15秒
        proxy_read_timeout 3s;
        # 设置X-Forwarded-Proto头为http
        proxy_set_header X-Forwarded-Proto http;
        # 设置X-Real-IP头为客户端的真实IP
        proxy_set_header X-Real-IP $remote_addr;
        # 设置X-Forwarded-For头
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 定义用于存储从后端服务器接收的数据的缓冲区大小。适当调整此参数可以提高性能
        proxy_buffer_size 16k;
        # 在stream上下文中启用SSL预读，使得Nginx可以在不解密的情况下读取TLS握手信息，
        # 从而根据SNI（Server Name Indication）字段选择正确的server块。
        ssl_preread on;
    }
}
```

因为Nginx可以负载均衡，你不想使用默认的`轮询`策略，可以修改，轮询一般适用于后端服务器性能相近且负载均衡要求不高的场景。
轮询就是将每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器宕机，能自动剔除。

你要修改可以使用`权重`修改，一般服务器性能好的可以设置高一些，多一些访问量：

```properties
upstream backend {
    server backend1.example.com weight=5;
    server backend2.example.com;
}
```

还有`IP 哈希`方式，根据客户端的 IP 地址进行哈希计算，将同一个 IP 的请求始终发送到同一个后端服务器：

```properties
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

`最少连接`方式，将请求发送到当前连接数最少的服务器。

```properties
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```

`通用哈希`方式，根据用户定义的 key（如 URI、header 等）进行哈希计算，将请求发送到相应的服务器。

```properties
upstream backend {
    hash $request_uri consistent;
    server backend1.example.com;
    server backend2.example.com;
}
```

还有`zone`定义共享内存区域，用于存储upstream模块的状态信息，如服务器健康检查结果

```properties
upstream backend {
    zone backend 64k;
    server 192.168.0.1:25;
    server 192.168.0.2:25;
}
# 启用主动健康检查，定期发送探测请求以验证后端服务器的可用性。仅当服务器响应正常时，才会将其加入到负载均衡池中。
upstream backend {
    server 192.168.0.1:25;
    server 192.168.0.2:25;
    health_check;
}
# 指定用于健康检查的URI路径。对于HTTP/HTTPS服务，可以通过这个路径发送GET请求来检查服务器状态。
upstream backend {
    server 192.168.0.1:80;
    server 192.168.0.2:80;
    health_check uri=/status;
}
```

## 官网教程和相关资源

其实Nginx的配置项还有很多很多，只有看官网的文档一点点核对。

[Nginx基础配置-官网](https://nginx.org/en/docs/beginners_guide.html){ .md-button .md-button--primary }
[Nginx http块配置-官网](https://nginx.org/en/docs/http/ngx_http_core_module.html){ .md-button .md-button--primary }
[Nginx中文文档](https://github.com/DocsHome/nginx-docs){ .md-button .md-button--primary }


[Nginx预防DDoS](https://blog.nginx.org/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus){ .md-button .md-button--primary }
[Nginx限流](https://blog.nginx.org/blog/rate-limiting-nginx){ .md-button .md-button--primary }