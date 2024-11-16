---
title: Spring事务传播机制
description: Spring事务传播机制
---

# Spring事务传播机制

spring事务传播机制，传播传播，最重要的一点就是在方法嵌套调用的时候，自己的事务到底怎么决策，你想，有事务的方法调用带事务的方法，
到底怎么做，没有又怎么做？这个就是事务传播机制，而且这个东西强调被调用方的决策行为，向哪里看齐？向调用方的行为看齐，怎么看齐？
就看具体的事务传播机制

而Spring事务传播机制它一共有7种情况：

!!! Note ""
    - **REQUIRED**：如果当前存在事务，则加入该事务；如果没有事务，则创建一个新的事务。
    - **SUPPORTS**：如果当前存在事务，则加入该事务；如果没有事务，则以非事务方式执行。
    - **MANDATORY**：如果当前存在事务，则加入该事务；如果没有事务，则抛出异常。
    - **REQUIRES_NEW**：无论当前是否存在事务，都创建一个新的事务。
    - **NOT_SUPPORTED**：以非事务方式执行操作，如果当前存在事务，则将其挂起。
    - **NEVER**：以非事务方式执行，如果当前存在事务，则抛出异常。
    - **NESTED**：如果当前存在事务，则在嵌套事务内执行；如果没有事务，则创建一个新的事务。

如果看到上面其中机制的解答不是很明白，正常，我觉得，这个就是机翻的问题，翻译的不好，它对“`当前`”并没有做出解答，
还好自己还记得当时作为初学者时对这个东西的疑惑。下面就一一解析这7种机制到底是怎么回事。

## 1️⃣REQUIRED

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务，就是调用方有事务），
那么被`@Transactional(propagation = Propagation.REQUIRED)`注解的方法会，加入到这个已存在的事务中。
这意味着该方法的操作会被包含在当前事务中，并且与当前事务共享同一个事务上下文。
这种解释自己也不是很喜欢，其实就是不管有几个事务存在，都合并成一个事务来处理，只要有一个事务抛出异常，所有事务都会回滚。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.REQUIRED)
public void methodB() {
    // 由于methodA已经开启了一个事务，methodB会加入到这个事务中
    // 执行一些数据库操作
}
```

在这种情况下，methodB的操作会被包含在methodA的事务中。如果methodB抛出异常，整个事务（包括methodA和methodB的操作）都会回滚。

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务，就是调用方没有事务），那么被`@Transactional(propagation = Propagation.REQUIRED)`注解的方法会创建一个新的事务。这意味着该方法的操作会在一个新的事务上下文中执行。这个其实就是你既然没事务，我自己就开一个事务自己来。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.REQUIRED)
public void methodB() {
    // 由于methodA没有事务，methodB会创建一个新的事务
    // 执行一些数据库操作
}
```

在这种情况下，methodB会创建一个新的事务，并且在该事务上下文中执行操作。如果methodB抛出异常，只有methodB的操作会回滚，methodA的操作不会受到影响。

## 2️⃣SUPPORTS

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务），那么被`@Transactional(propagation = Propagation.SUPPORTS)`注解的方法会加入到这个已存在的事务中。这意味着该方法的操作会被包含在当前事务中，并且与当前事务共享同一个事务上下文。这个和REQUIRED一样。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.SUPPORTS)
public void methodB() {
    // 由于methodA已经开启了一个事务，methodB会加入到这个事务中
    // 执行一些数据库操作
}
```

在这种情况下，methodB的操作会被包含在methodA的事务中。如果methodB抛出异常，整个事务（包括methodA和methodB的操作）都会回滚。

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务），那么被`@Transactional(propagation = Propagation.SUPPORTS)`注解的方法会以非事务方式执行。这意味着该方法的操作不会在事务上下文中执行，而是直接执行。这里就不一样了，要是调用方没有事务，自己的事务也就没有了。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.SUPPORTS)
public void methodB() {
    // 由于methodA没有事务，methodB会以非事务方式执行
    // 执行一些数据库操作
}
```

在这种情况下，methodB的操作不会在事务上下文中执行。如果methodB抛出异常，methodB的操作不会回滚，因为它们没有在事务中执行。

## 3️⃣MANDATORY

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务），那么被`@Transactional(propagation = Propagation.MANDATORY)`注解的方法会加入到这个已存在的事务中。这意味着该方法的操作会被包含在当前事务中，并且与当前事务共享同一个事务上下文。这个也和REQUIRED一样。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.MANDATORY)
public void methodB() {
    // 由于methodA已经开启了一个事务，methodB会加入到这个事务中
    // 执行一些数据库操作
}
```

在这种情况下，methodB的操作会被包含在methodA的事务中。如果methodB抛出异常，整个事务（包括methodA和methodB的操作）都会回滚。

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务），那么被`@Transactional(propagation = Propagation.MANDATORY)`注解的方法会抛出异常。这意味着该方法必须在事务上下文中被调用，否则会失败。这是MANDATORY不一样的地方，他强调调用方一定要自带事务，没有就不行。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.MANDATORY)
public void methodB() {
    // 由于methodA没有事务，methodB会抛出异常
    // 执行一些数据库操作
}
```

在这种情况下，methodB会抛出异常，因为methodA没有开启事务。methodB必须在事务上下文中被调用，否则会失败。

## 4️⃣REQUIRES_NEW

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务），那么被`@Transactional(propagation = Propagation.REQUIRES_NEW)`注解的方法会暂停当前事务，并创建一个新的事务。这意味着该方法的操作会在一个全新的事务上下文中执行，与当前事务完全独立。这里开始就不一样了，REQUIRES_NEW强调调用方有事务，自己的事务要求是独立的，而且要等我自己的执行完，调用方的才可以继续执行。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void methodB() {
    // 创建一个新的事务，暂停methodA的事务
    // 执行一些数据库操作
}
```

在这种情况下：methodA开启了一个新的事务。methodB创建了一个新的事务，并暂停了methodA的事务。<br>
如果methodB抛出异常，只有methodB的操作会回滚，因为methodB在一个独立的事务中执行。methodA的操作不会受到影响，除非methodB的异常传播到methodA。[^1]
[^1]: 就是methodB抛异常了

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务），那么被`@Transactional(propagation = Propagation.REQUIRES_NEW)`注解的方法会创建一个新的事务。这意味着该方法的操作会在一个全新的事务上下文中执行。这个就是正常的开新事务执行。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void methodB() {
    // 创建一个新的事务
    // 执行一些数据库操作
}
```

在这种情况下：methodA没有开启事务。methodB创建了一个新的事务。<br>
如果methodB抛出异常，只有methodB的操作会回滚，因为methodB在一个独立的事务中执行。methodA的操作不会受到影响。

## 5️⃣NOT_SUPPORTED

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务），那么被`@Transactional(propagation = Propagation.NOT_SUPPORTED)`注解的方法会挂起当前事务，并以非事务方式执行。这意味着该方法的操作不会在事务上下文中执行，而是直接执行。这个会和REQUIRES_NEW一样挂起被调用方的事务，
但是自己的执行就不是带事务的了。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void methodB() {
    // 挂起methodA的事务，以非事务方式执行
    // 执行一些数据库操作
}
```

在这种情况下：methodA开启了一个新的事务。methodB挂起了methodA的事务，并以非事务方式执行。<br>
如果methodB抛出异常，methodB的操作不会回滚，因为它们没有在事务中执行。methodA的操作不会受到影响，除非methodB的异常传播到methodA。

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务），那么被`@Transactional(propagation = Propagation.NOT_SUPPORTED)`注解的方法会以非事务方式执行。这意味着该方法的操作不会在事务上下文中执行，而是直接执行。就是大家都没有事务了。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void methodB() {
    // 以非事务方式执行
    // 执行一些数据库操作
}
```

在这种情况下：methodA没有开启事务。methodB以非事务方式执行。<br>
如果methodB抛出异常，methodB的操作不会回滚，因为它们没有在事务中执行。methodA的操作不会受到影响。

## 6️⃣NEVER

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务），那么被`@Transactional(propagation = Propagation.NEVER)`注解的方法会抛出异常。这意味着该方法不允许在事务上下文中执行。就是强调被调用方要求不带有事务，有就不行。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.NEVER)
public void methodB() {
    // 由于methodA已经开启了一个事务，methodB会抛出异常
    // 执行一些数据库操作
}
```

在这种情况下：methodA开启了一个新的事务。methodB会抛出异常，因为methodA已经存在一个事务,Spring 的事务管理器会默认将 methodA 的事务标记为回滚。

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务），那么被`@Transactional(propagation = Propagation.NEVER)`注解的方法会以非事务方式执行。这意味着该方法的操作不会在事务上下文中执行，而是直接执行。没有事务，大家都没有，就是被它修饰的方法，永远不能运行在事务中。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.NEVER)
public void methodB() {
    // 以非事务方式执行
    // 执行一些数据库操作
}
```

在这种情况下：methodA没有开启事务。methodB以非事务方式执行。<br>
如果methodB抛出异常，methodB的操作不会回滚，因为它们没有在事务中执行。methodA的操作不会受到影响。

## 7️⃣NESTED

### 当前存在事务

如果当前已经存在一个事务（即调用方法的上下文中已经有一个活跃的事务），那么被`@Transactional(propagation = Propagation.NESTED)`注解的方法会在嵌套事务内执行。嵌套事务是外部事务的一部分，但可以独立回滚。这意味着如果嵌套事务回滚，外部事务可以选择是否回滚。这个就是将两者的事务独立，彼此到底怎么做，可以用编码的方式来控制。

```java title="示例"
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // 开始一个新的事务
    // 执行一些数据库操作
    methodB();
    // 继续执行一些数据库操作
}

@Transactional(propagation = Propagation.NESTED)
public void methodB() {
    // 在嵌套事务内执行
    // 执行一些数据库操作
}
```

在这种情况下：methodA开启了一个新的事务。methodB在嵌套事务内执行。<br>
如果methodB抛出异常并回滚，methodB的操作会回滚，但methodA可以选择是否回滚。如果methodA捕获了methodB的异常并继续执行，methodA的操作不会回滚。

### 当前不存在事务

如果当前不存在事务（即调用方法的上下文中没有活跃的事务），那么被`@Transactional(propagation = Propagation.NESTED)`注解的方法会创建一个新的事务。这意味着该方法的操作会在一个全新的事务上下文中执行。

```java title="示例"
public void methodA() {
    // 没有事务
    methodB();
}

@Transactional(propagation = Propagation.NESTED)
public void methodB() {
    // 创建一个新的事务
    // 执行一些数据库操作
}
```

在这种情况下：methodA没有开启事务。methodB创建了一个新的事务。<br>
如果methodB抛出异常，只有methodB的操作会回滚，因为methodB在一个独立的事务中执行。methodA的操作不会受到影响。

## 附一张可能有一点参考意义的表格

<img src="../img/事务传播机制.png" style="zoom: 50%;" />