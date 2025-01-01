---
title: Java中的空值处理和工具类
description: Java中的空值处理和工具类
---

# Java中的空值处理和工具类

一般经常写业务类型代码的程序员，都会遇到空值的处理判断，处理这个东西的必要性就像是喝水一样自然，
不做轻则造成业务无法满足需求，重则造成程序崩溃，常见有重要。现在自己整理一下，可以水一篇。

## 前端参数校验

前端传给你参数，有一些是系统必要值，无论是业务设计的还是逻辑需要，要求保证传输到后端，这个字段不能为空，
一般我们的处理都是判空，是空值就赋默认值或抛异常。

```java
if(obj == null) {
    ...
}
```

而一般传输过程中，不会给复杂对象，都是JSON最多，方便高效，而JSON都是一些字符串、数字、数组、集合等，它们的判断，就可以依赖于一个框架：
`javax.validation`，Java17后改名成`jakarta.validation`，以我自己浅薄的工作经验，我没有遇到过不使用它的业务类项目。

这个工具对于字符串、集合都有自己的注解校验，对web应用很友好，这样我们使用的时候，就不用一直进行判空，减少了很多业务逻辑，精简代码专注于业务逻辑。如：

```java
public class User {
    @NotNull(message = "不能为空")
    private Integer id;
    
    @NotBlank(message = "不能为空")
    private String name;
    
    @NotEmpty(message = "不能为空")
    private List<String> list;
    
    @NotNull(message = "不能为空")
    private LocalDateTime time;
}
```

使用的时候再进行对象整体的空值判断`@Valid`，要让user整体不为空。它还有校验组等等的使用方式。

```java
@PostMapping("/addUser")
@Operation(summary = "新增用户")
public R<Boolean> addUser(@RequestBody @Valid User user) {
    return ok(userService.addUser(user));
}
```

这个框架检验的机制，是在spring框架接收到请求并尝试将请求数据绑定到Java对象之后触发的，一定是在数据绑定之后，业务执行之前。
那么这样的原理，使得框架其实也有一定的缺点，它在其他场景下无法触发无法使用。而判空无处不在。

## 普通对象空值处理

比如excel导入的时候，需要对excel转出来的值进行非空判断，有一些数据它不能为空；比如非幂等接口做幂等处理，
先查看数据存不存在；比如获取系统配置，配置获取是否有值。

对于一般的对象，我们可以使用 `==` 来判断，但是Java八股文里面，`==`判断对象，常常是出问题的一种，比如Integer的128限制
而使用`equals`，又需要写各种判断组合在一起才能满足需求，那就可以借助工具类，直观不关心底层，如

```java
// java.util原生工具包对象处理
if(Objects.isNull(obj)) {
    ...
}
// hutool工具字符串处理
if(StrUtil.isBlank(obj)) {
    ...
}
// hutool工具集合判空
if (CollUtil.isNotEmpty(obj)) {
    ...
}
// spring框架自带字符串处理工具
if (StringUtils.hasText(obj)) {
    ...
}
```

这些东西都可以帮助你来精简代码，别人来读也知道你在判断啥。有时候我们还需要抛异常，或者做其他处理，那一些的工具类都很方便，

```java
public static void main(String[] args) {
    Objects.requireNonNull(args, "args参数为空");
    ObjUtil.defaultIfBlank(null, "123");
    CollUtil.defaultIfEmpty(null, Lists.newArrayList("1", "2", "3"));
}
```

这样代码也很直观。我倒不是介绍工具类，主要是要有代码精简的意识，同时知道这些工具类的使用可以帮助你来避免自己实现一些功能可能出现的差错。

## Optional

Java的这个工具主要还是来处理空指针，也需要看场景合不合适，反正对这个工具历来都是有两派，一派觉得可以有效避免空指针的显式异常，
代码可以更加优雅一些(就是函数式编程+封装好的流式API)，也很高效；一派觉得空指针是数据不存在为空，是任何东西都无法避免的，没有就是没有，让值有数据才叫解决空指针，觉得这个类效率低还过度封装。

具体的论调有点忘了。我不一一介绍使用方式。

```java
// 这样也能实现空值抛异常
Optional.ofNullable(args).orElseThrow(() -> new RuntimeException("null"));
// 判断值在不在
Optional.of(args).isPresent();
// 空值则赋值
Optional.ofNullable(args).orElse(new String[]{"1"});
```

它还有很多使用方式，配合Java本身的stream流，代码确实可以流畅很多。

## 观点

其实空值处理的方式多种多样，用啥工具不太重要，但是一是要有处理空值的意识，二是要有使用工具处理空值的意识，轮子我们不重复造，
但我们要经常用，还有就是知道在何时使用合适的工具，有精简代码的意识。在业务密集型需求密集型的项目中，可能技术不是那么重要，
对业务的处理经验更加重要一些，同时一份代码经常好几个人接手，精简以增加可读性，也是使得项目不成为屎山的一点手段，
至少是一种修养，搞得好也挺“技术”的。