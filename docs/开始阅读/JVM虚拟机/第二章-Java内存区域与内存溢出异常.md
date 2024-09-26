---
title: 第二章-Java内存区域与内存溢出异常
description: 第二章-Java内存区域与内存溢出异常
---

# 第二章-Java内存区域与内存溢出异常

## 2.1 运行时数据区

<div style="text-align: center"><img src="../img/2/JavaMemoryArea.png" style="zoom: 60%;"/></div>

!!! Note "概念解释"
    <u>线程共享</u>：随着虚拟机进程的启动而一直存在<br>
    <u>线程隔离</u>：依赖用户线程的启动和结束而建立和销毁

### 2.1.1 程序计数器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
程序计数器（Program Counter Register）是一块较小的内存空间，它可以看作是<wavy>当前线程所执行的字节码的行号指示器</wavy>。
在 Java 虚拟机的概念模型里，字节码解释器工作时就是<wavy>通过改变这个计数器的值来选取下一条需要执行的字节码指令</wavy>，
它是程序控制流的指示器，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。

!!! Note "PCR线程隔离原因"
    为了线程切换后能恢复到正确的执行位置，每条线程都需要有一个独立的程序计数器，各条线程之间计数器互不影响，独立存储。

### 2.1.2 Java虚拟机栈

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Java虚拟机栈描述的是 Java 方法执行的线程内存模型：每个方法被执行的时候，Java 虚拟机都会同步创建一个栈帧（Stack Frame）[^1]
用于`存储局部变量表`、`操作数栈`、`动态连接`、`方法出口`等信息。每一个方法被调用直至执行完毕的过程，
就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。
[^1]:栈帧是方法运行期很重要的基础数据结构，第 8 章中会对帧进行详细讲解

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<wavy>局部变量表存放了编译期可知的各种 Java 虚拟机基本数据类型（boolean、byte、 char、short、int、 float、long、double）、对象引用（reference 类型</wavy>，它并不等同于对象本身，可能是一个指向对象起始地址的引用指针，也可能是指向一个代表对象的句柄或者其他与此对象相关的位置）和 returnAddress 类型（指向了一条字节码指令的地址）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
这些数据类型在局部变量表中的存储空间以局部变量槽（Slot）来表示，其中 64 位长度的 long 和 double 类型的数据会占用两个变量槽，其余的数据类型只占用一个。

### 2.1.3 本地方法栈

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，其区别只是虚拟机栈为虚拟机执行 Java 方法（也就是字节码）服务，
而<wavy>本地方法栈则是为虚拟机使用到的本地（Native）方法服务</wavy>。

### 2.1.4 Java堆

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
对于 Java 应用程序来说，Java 堆（Java Heap）是虚拟机所管理的<wavy>内存中最大的一块</wavy>。
Java 堆是<wavy>被所有线程共享</wavy>的一块内存区域，<wavy>在虚拟机启动时创建</wavy>。
**此内存区域的唯一目的就是存放对象实例**，Java 世界里“几乎”所有的对象实例都在这里分配内存。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Java 堆是垃圾收集器管理的内存区域：

??? Info "从回收内存的角度看(了解，太细了)"
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    由于现代垃圾收集器大部分都是基于分代收集理论设计的，所以 Java 堆中经常会出现`“新生代”``“老年代”``“永久代”``“Eden空间”``“From Survivor 空间”``“To Survivor 空间”`等名词，
    这些概念在本书后续章节中还会反复登场亮相，在这里笔者想先说明的是这些区域划分仅仅是一部分垃圾收集器的共同特性或者说设计风格而已，
    而非某个 Java 虚拟机具体实现的固有内存布局，更不是《Java 虚拟机规范》里对 Java 堆的进一步细致划分。
    不少资料上经常写着类似于“Java 虚拟机的堆内存分为新生代、老年代、永久代、Eden、Survivor……”这样的内容。
    在十年之前（以 G1 收集器的出现为分界），作为业界绝对主 流的 HotSpot 虚拟机，它内部的垃圾收集器全部都基于“经典分代” 来设计，
    需要新生 代、老年代收集器搭配才能工作，在这种背景下，上述说法还算是不会产生太大歧义。 
    但是到了今天，垃圾收集器技术与十年前已不可同日而语，HotSpot 里面也出现了不采 用分代设计的新垃圾收集器，
    再按照上面的提法就有很多需要商榷的地方了。

??? Info "从分配内存的角度看(了解，太细了)"
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    所有线程共享的 <wavy>Java 堆中可以划分出多个线程私有的分配缓冲区</wavy>（Thread Local Allocation Buffer，TLAB），
    <wavy>以提升对象分配时的效率</wavy>。不过无论从什么角度，无论如何划分，都不会改变 Java 堆中存储内容的共性，
    无论是哪个区域，<wavy>存储的都只能是对象的实例</wavy>，将 Java 堆细分的目的只是为了更好地回收内存，或者更快地分配内存。

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Java 堆可以处于物理上不连续的内存空间中，但<wavy>在逻辑上它应该被视为连续的</wavy>。
    <wavy>Java 堆既可以被实现成固定大小的，也可以是可扩展的</wavy>。

### 2.1.5 方法区

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
方法区（Method Area）与 Java 堆一样，是各个线程共享的内存区域，
它<wavy>用于存储已被虚拟机加载的`类型信息`、`常量`、`静态变量`、`即时编译器编译后的代码缓存`等数据</wavy>。
这区域的内存回收目标主要是针对常量池的回收和对类型 的卸载。
如果方法区无法满足新的内存分配需求时，将抛出 OutOfMemoryError 异常。

### 2.1.6 运行时常量池

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
运行时常量池（Runtime Constant Pool）是方法区的一部分。Class 文件中除了有类 的版本、字段、方法、接口等描述信息外，
还有一项信息是<wavy>常量池表</wavy>（Constant Pool Table），<wavy>用于存放编译期生成的各种字面量与符号引用</wavy>，
这部分内容将在类加载后存放到方法区的运行时常量池中。当常量池无法再申请到内存时会抛出 OutOfMemoryError 异常。

## 2.2 HotSpot 虚拟机对象探秘

现在最新的已经不使用HotSpot了，采用[Graalvm](https://www.oracle.com/cn/java/graalvm/)，
但不代表这个知识没用了。

### 2.2.1 对象的创建

当 Java 虚拟机遇到一条字节码 new 指令时，

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
1️⃣首先将去检查这个指令的参数是否能在常量池中定位到一个类的符号引用，
并且检查这个符号引用代表的类是否已被加载、解析和初始化过。如果没有，那必须先执行相应的类加载过程。[^2]
[^2]: 类加载过程在第七章

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
2️⃣在类加载检查通过后，接下来虚拟机将为新生对象分配内存。

??? Question "细节：如何为新生对象分配内存？"
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <wavy>内存规整的情况下</wavy>：
    对象所需内存的大小 在类加载完成后便可完全确定（如何确定将在下节中介绍），
    为对象分配空间的任务实际上便等同于把一块确定大小的内存块从 Java 堆中划分出来。
    假设 Java 堆中内存是绝对规整的，所有被使用过的内存都被放在一边，空闲的内存被放在另一边，
    中间放着一个指针作为分界点的指示器，那所分配内存就仅仅是把那个指针向空闲空间方向挪动一段与对象大小相等的距离，
    这种分配方式称为`“指针碰撞”`（Bump The Pointer）。

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <wavy>内存不规整的情况下</wavy>：
    那就 没有办法简单地进行指针碰撞了，虚拟机就必须维护一个列表，记录上哪些内存块是可 用的，在分配的时候从列表中找到一块足够大的空间划分给对象实例，并更新列表上的 记录，这种分配方式称为`“空闲列表”`（Free List）。

??? Question "内存分配的线程安全问题"
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    对象创建在虚拟机中是非常频繁的行为，即使修改一个指针所指向的位置，在并发情况下也并不是线程安全的，可能出现正在给对象 A 分配内存，
    指针还没来得及修改，对象 B 又同时使用了原来的指针来分配内存的情况。

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    **方案一**：<wavy>对分配内存空间的动作进行同步处理</wavy>——实际上虚拟机是采用 CAS 配上失败重试的方式保证更新操作的原子性；

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    **方案二**：<wavy>把内存分配的动作按照线程划分在不同的空间之中进行</wavy>，即每个线程在 Java 堆中预先分配一小块内存，
    称为`本地线程分配缓冲`（Thread Local Allocation Buffer，TLAB），哪个线程要分配内存，
    就在哪个线程的本地缓冲区中分配，只有本地缓冲区用完了，分配新的缓存区时才需要同步锁定。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
3️⃣内存分配完成之后，虚拟机必须将分配到的内存空间（但不包括对象头）都初始化为零值。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
4️⃣接下来，Java 虚拟机还要对对象进行必要的设置，例如这个对象是哪个类的实例、
如何才能找到类的元数据信息、对象的哈希码（实际上对象的哈希码会延后到真正调用 Object::hashCode()方法时才计算）、对象的 GC 分代年龄等信息。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
这样对象才算是创建完成

### 2.2.2 对象的内存布局

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
在 HotSpot 虚拟机里，对象在堆内存中的存储布局可以划分为三个部分：`对象头`（Header）、`实例数据`（Instance Data）和`对齐填充`（Padding）。

1️⃣ **对象头** 分为两类：

- 第一类是<wavy>用于存储对象自身的运行时数据</wavy>，
如`哈希码`（HashCode）、`GC分代年龄`、`锁状态标志`、`线程持有的锁`、`偏向线程ID`、`偏向时间戳`等，
这部分数据的长度在 32 位和 64 位的虚拟机（未开启压缩指针）中分别为 32 个比特和 64 个比特，官方称它为“Mark Word”。
- 对象头的另外一部分是<wavy>类型指针，即对象指向它的类型元数据的指针</wavy>，Java 虚拟机通过这个指针来确定该对象是哪个类的实例。

表：HotSpot 虚拟机对象头 Mark Word

| 存储内容                          | 标志位 | 状态           |
| ------                           | ------ | ------        |
| 对象哈希码、对象分代年龄           | 01    | 未锁定           |
| 指向锁记录的指针                   | 00   | 轻量级锁定       |
| 指向重量级锁的指针                 | 10   | 膨胀(重量级锁定)   |
| 空，不需要记录信息                 | 11   | GC标志           |
| 偏向线程ID、偏向时间戳、对象分代年龄 | 01   | 可偏向          |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
2️⃣ **实例数据部分** 是<wavy>对象真正存储的有效信息</wavy>，即我们在程序代码里面所定义的各种类型的字段内容。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
3️⃣ **对齐填充** ，这并不是必然存在的，也没有特别的含义，它<wavy>仅仅起着占位符的作用</wavy>，
如果对象实例数据部分没有对齐的话，就需要通过对齐填充来补全。

### 2.2.3 对象的访问定位

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
创建对象自然是为了后续使用该对象，我们的 Java 程序<wavy>会通过栈上的 reference 数据来操作堆上的具体对象</wavy>。

主流的访问方式主要有使用句柄和直接指针两种：

- 「句柄访问」：Java 堆中将可能会划分出一块内存来作为句柄池，reference 中存储的就是对象的句柄地址，而句柄中包含了对象实例数据与类型数据各自具体的地址信息
- 「直接指针访问」：Java 堆中对象的内存布局就必须考虑如何放置访问类型数据的相关信息，reference 中存储的直接就是对象地址，如果只是访问对象本身的话，就不需要多一次间接访问的开销。最大的好处就是速度更快，它节省了一次指针定位的时间开销，也是HotSpot的实现

<div style="text-align: center"><img src="../img/2/AccessLocation.png" style="zoom: 60%;"/></div>

## 2.3 实战 OutOfMemoryError 异常

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
这部分的实战感觉不太适合自己的实际经历，无论是用的工具还是代码样例，最多就是教你啥是啥，不够实用，
说白了就是不适合实际项目开发，只是宽泛的说了一下概念，
用代码样例介绍了一下 `OutOfMemoryError` 和 `StackOverflowError`可能会触发的条件，
但是实际项目中造成这样的原因五十五花八门，他介绍的解决方法就不一定行了。实际项目出现这些原因，一般是代码写的有问题，
先排查这个，99%都是，逻辑是不是死循环了？线程之间的问题？数据结构是不是有问题，基本轮不到线上发现，自己跑一遍就知道了，
其它的就是运维的事情，jvm参数、实际物理内存、一些专业的定位工具等。这个要详细讲就越来越复杂，就是怎么定位生产中的实际问题并解决，
一是吃经验，二是也难讲清楚，三是和自己项目的细节强挂钩，不具有广泛的代表性。
还有一些代码要在32位机子运行，这去哪里搞？[^3]
[^3]: 代码下载页：[《深入理解Java虚拟机（第3版）》样例代码&勘误](https://github.com/fenixsoft/jvm_book)

