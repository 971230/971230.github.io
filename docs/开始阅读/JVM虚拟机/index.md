---
title: JVM虚拟机
description: 总结一下JVM虚拟机相关知识
icon: octicons/server-16
---

# JVM虚拟机

!!! Abstract
    主要总结一下虚拟机相关的知识，大多照抄周志明著作的《深入理解JVM虚拟机》第三版（机械工业出版社）,
    算是自己的读书笔记了，这本书对于jvm的讲解算是很详细了，个人认为是一本很好的书，我看的是第三版，
    里面的有一些东西相较于现在略略落后，尽管Java现在都23了，但是有些东西你再先进，也不变的。
    这个东西偏八股文，几乎都是纯理论性的，最多就是调参可能会在做服务维护的时候用一下，
    其它的感觉更多还是帮助你去理解Java这门语言的一些底层运作机制，实用性感觉还是差一些。
    [《深入理解Java虚拟机（第3版）》样例代码&勘误](https://github.com/fenixsoft/jvm_book)

- <a class="navigation" href="第一章-走进Java/">① 第一章-走进Java</a>
- <a class="navigation" href="第二章-Java内存区域与内存溢出异常/">② 第二章-Java内存区域与内存溢出异常</a>
- <a class="navigation" href="第三章-垃圾收集器与内存分配策略/">③ 第三章-垃圾收集器与内存分配策略</a>
- <a class="navigation" href="第四章-虚拟机性能监控、故障处理工具/">④ 第四章-虚拟机性能监控、故障处理工具</a>
- <a class="navigation" href="第五章-调优案例分析与实战/">⑤ 第五章-调优案例分析与实战</a>
- <a class="navigation" href="第六章-类文件结构/">⑥ 第六章-类文件结构</a>
- <a class="navigation" href="第七章-虚拟机类加载机制/">⑦ 第七章-虚拟机类加载机制</a>
- <a class="navigation" href="第八章-虚拟机字节码执行引擎/">⑧ 第八章-虚拟机字节码执行引擎</a>
- <a class="navigation" href="第九章-类加载及执行子系统的案例与实战/">⑨ 第九章-类加载及执行子系统的案例与实战</a>
- <a class="navigation" href="第十章-前端编译与优化/">⑩ 第十章-前端编译与优化</a>
- <a class="navigation" href="第十一章-后端编译与优化/">⑪ 第十一章-后端编译与优化</a>
- <a class="navigation" href="第十二章-Java内存模型与线程/">⑫ 第十二章-Java内存模型与线程</a>
- <a class="navigation" href="第十三章-线程优化与锁优化/">⑬ 第十三章-线程优化与锁优化</a>