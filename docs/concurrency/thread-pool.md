# 线程池模式（Thread Pool Pattern）

线程池预先创建一批工作线程，任务交给队列，线程反复从队列取任务执行。它把"每次任务都新建线程"的创建开销、以及无限制创建线程导致的资源耗尽，换成一段可控的并发度。Java 的 `ThreadPoolExecutor` 是这条模式的标准参照 [S19]。

## 解决什么

1. **创建开销**：线程创建与销毁要走内核，一次几十微秒，任务本身只有几微秒时，开销比工作还大。
2. **并发失控**：每个请求开一个线程，10 万个在飞请求就是 10 万个线程，栈内存先耗尽（默认每线程 1 MB 栈，1 万线程就是 10 GB）。
3. **削峰**：任务到达速度快于处理速度时，队列把突峰压平，线程数保持不变。

不适用的一类是长阻塞、彼此等待的任务：线程池大小有限，池里线程被占满后新任务排队，彼此等待会死锁（见下面的参数一节）。

## 参数怎么定

`ThreadPoolExecutor` 的七个参数里，真正要拍板的是四个：

| 参数 | 作用 | 怎么定 |
| --- | --- | --- |
| 核心线程数 | 常驻线程 | CPU 密集任务取 `CPU 核数` 上下；I/O 密集取 `核数 × (1 + 等待时间/计算时间)`，先算再压测调 |
| 最大线程数 | 队列满后临时扩到 | 不要无限大，它只是核数与突峰之间的缓冲 |
| 队列容量 | 任务排队处 | 有界且偏小。无界队列会让最大线程数形同虚设，任务全堆在队列里，延迟悄悄上涨 |
| 拒绝策略 | 队列与线程都满时 | 常见四种：丢弃、丢最老、调用方自己跑、抛异常。金融类任务一般用"调用方自己跑"或抛异常，静默丢弃要配监控 |

三条经验：

- **无界队列 + 大线程数**是常见误配：线程数扩不起来（队列先接住），内存先爆，而且看起来线程池"很闲"。
- **任务里有相互等待**（任务 A 等任务 B 的结果）会占满池子死锁。解法是把等待改成回调或拆到另一个池，见[Future 模式](/concurrency/future)。
- **池要做优雅关闭**：`shutdown()` 只接收新任务不拒绝，等存量跑完；直接 `shutdownNow()` 会打断在跑的任务。

## 示例

Java：显式给四个关键参数，不用 `Executors.newFixedThreadPool` 之类的工厂捷径（它们的队列或线程数常是无界的）。

```java
import java.util.concurrent.*;

public class PoolExample {
    public static void main(String[] args) {
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
                8,                                  // 核心线程
                32,                                 // 最大线程
                30, TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(200),      // 有界队列
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy()  // 满了让提交方自己跑，天然反压
        );

        for (int i = 0; i < 1000; i++) {
            pool.execute(() -> System.out.println(Thread.currentThread().getName()));
        }

        pool.shutdown();                            // 不再接新任务，等存量结束
        try {
            pool.awaitTermination(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            pool.shutdownNow();
        }
    }
}
```

Go 没有线程池类，等价物是"固定数量的 goroutine 从同一个 channel 取任务"：

```go
func workerPool(jobs <-chan Job, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {   // channel 关闭后自动退出
                job.run(id)
            }
        }(i)
    }
    wg.Wait()
}
```

这里的并发上限是 goroutine 数量，队列是 channel 的缓冲，满了之后发送方阻塞，对应 Java 版的 CallerRunsPolicy 反压。C++ 的等价物是 `std::thread` 加任务队列，或 C++20 的 `std::jthread` 配合 `std::stop_token` 做优雅停止。

## 观察指标

- 队列深度持续增长：处理速度跟不上提交速度，先看线程数还是先看单任务耗时。
- 活跃线程长期等于最大线程数：要么任务太重，要么队列太大让线程一直被抢。
- 拒绝次数 > 0：反压开始生效，这是信号不是故障，但要能看见。

## 相关篇目

- [生产者-消费者模式](/concurrency/producer-consumer)：线程池内部就是这个结构的实例。
- [对象池](/creational/object-pool)：池化复用的通用形态，线程池是它的一种资源。
- [Future 模式](/concurrency/future)：提交任务后拿回结果的句柄。
- [信号量模式](/concurrency/semaphore)：用许可数控制并发，和线程池是两种限流手段。
- [读写锁](/concurrency/read-write-lock)：任务内部要共享状态时的加锁选择。
- [工作窃取](/concurrency/work-stealing)：线程池处理 CPU 密集分片任务时的调度方式。

## 来源

- [S19] Java SE API `java.util.concurrent` 包说明，`ThreadPoolExecutor` 参数与语义。
- [S21] Go 官方文档，goroutine 与 channel 的惯用法。
- [S9] POSA 卷 2，线程池与半同步/半异步相关的并发结构。
