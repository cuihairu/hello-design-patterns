# 工作窃取模式（Work Stealing Pattern）

工作窃取给每个线程一个本地双端队列：任务进自己的队尾，本线程从队头取；线程空了就去别的线程的队尾"偷"一个任务到自己队里执行。它解决的是固定切分的两个极端：任务切太少浪费核，切太多同步开销大。JDK 的 `ForkJoinPool` 是这条模式的标准参照 [S19]，Cilk、TBB、以及不少协程调度器都用同一套结构。

## 解决什么

固定分块的写法要么预知任务数（未知就切不好），要么让所有线程抢同一个全局队列（锁竞争随线程数上升）。工作窃取把竞争打散：

- **本地队列无锁**：只有本线程写自己的队列，取自己队头的操作不需要同步。
- **偷取只发生在空闲时**：负载不均时自动补偿，忙的线程不会被打断，闲的线程自己找活。
- **切分自适应**：任务可以递归拆到很细，因为拆的代价只落在真正需要偷取的时刻。

代价是偷取要访问别人的数据，队尾操作与缓存行乒乓是实际开销；以及可复现性差——哪次执行走了哪条路径不固定，调试要靠记录而不是靠重跑。

## 结构

1. 每个工作线程一个 deque，支持三端操作：本端进、本端出（LIFO，保持局部性）、对端出（FIFO，偷走最老的，通常是大块任务）。
2. 本线程取队头用 LIFO：最近压进去的任务最可能还在缓存里。
3. 偷取从队尾取，偷到的通常是最先入队、还没被切开的大任务，一次偷取能换来较长的工作量。
4. 任务被偷走时，双方要按约定的同步方式交接（CAS 或分段锁），失败就重试或换下一个受害者。

## 示例

Java：`ForkJoinPool` 把这套结构做在库里，任务类按"够小就直接算，否则拆两半"写。

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class SumTask extends RecursiveTask<Long> {
    private static final int THRESHOLD = 10_000;
    private final long[] data;
    private final int lo, hi;

    SumTask(long[] data, int lo, int hi) {
        this.data = data;
        this.lo = lo;
        this.hi = hi;
    }

    @Override
    protected Long compute() {
        if (hi - lo <= THRESHOLD) {          // 足够小：直接算，别再拆
            long sum = 0;
            for (int i = lo; i < hi; i++) sum += data[i];
            return sum;
        }
        int mid = (lo + hi) >>> 1;
        SumTask left = new SumTask(data, lo, mid);
        SumTask right = new SumTask(data, mid, hi);
        left.fork();                          // 左边进自己的队列，右边就地执行
        long r = right.compute();
        return r + left.join();               // join 期间本线程可能去偷别的活
    }

    public static void main(String[] args) {
        long[] data = new long[1_000_000];
        System.out.println(ForkJoinPool.commonPool().invoke(new SumTask(data, 0, data.length)));
    }
}
```

`fork/join` 与 `invokeAll` 的区别就在这里：右分支就地算、左分支入队，等结果时线程空出来可以被别人偷走的活占上。

Go 标准库没有工作窃取池，自实现时用"每线程一个 slice 当 deque + 偷取时的互斥"即可；更常见的是让 goroutine 调度器替你做（GMP 调度器的 runq 与 stolen 逻辑同构 [S21]），业务代码直接起 goroutine。

## 用它的判断

- 任务能递归二分且子任务彼此独立 → 用，收益直接（归并排序、树遍历、批量求和）。
- 任务之间有依赖、必须按序 → 不用，切开会破坏顺序，见[生产者-消费者](/concurrency/producer-consumer)。
- 任务粒度是 I/O 等待 → 不用，等的是外部事件，线程数该由连接数决定，见[线程池](/concurrency/thread-pool)。
- 单核或核数固定且任务量均匀 → 不用，简单分块加屏障更省。

阈值 `THRESHOLD` 决定拆分深度：太小则调度开销吃掉收益，太大则偷取不均。做法是先按"一个任务控制在几十微秒"设，再压测调整，看偷取次数与总耗时的比例。

## 相关篇目

- [线程池](/concurrency/thread-pool)：工作窃取是线程池的一种任务分配策略。
- [生产者-消费者](/concurrency/producer-consumer)：任务流的另一种组织方式，适合 I/O 密集。
- [Future 模式](/concurrency/future)：`join()` 拿子任务结果就是 Future 的一次使用。
- [主动对象](/concurrency/active-object)：把调用排队到独立线程执行，与窃取调度处在不同层。

## 来源

- [S19] Java SE API `java.util.concurrent.ForkJoinPool` 说明。
- [S9] POSA 卷 2，任务池与主动对象一族的并发结构。
- [S21] Go 官方文档与博客，goroutine 调度与流水线。
