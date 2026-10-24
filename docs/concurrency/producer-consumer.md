# Producer-Consumer

The Producer-Consumer pattern is indeed a common concurrent design pattern. It belongs to the category of concurrent patterns and addresses the coordination between producers and consumers in a multi-threaded environment. The following is a detailed explanation of the Producer-Consumer pattern:

#### Use cases
- **Multi-threaded environment**: Need to share limited resources among multiple threads.
- **Task scheduling**: Producers generate tasks, consumers process tasks.
- **Data stream processing**: Producers produce data, consumers process data.

#### Pattern description
The Producer-Consumer pattern uses one or more producer threads to generate data or tasks and place them into a buffer or queue. Meanwhile, one or more consumer threads take data or tasks from the buffer or queue for processing. This pattern balances the speed differences between producers and consumers and avoids direct interaction between them.

#### Implementation approaches
The Producer-Consumer pattern can be implemented in several ways, for example:
- **Blocking queue**: Use a blocking queue as the buffer. Producers place data into the queue, and consumers take data from the queue. When the queue is full, producers block; when the queue is empty, consumers block.
- **Semaphore**: Use a semaphore to control access to the buffer.
- **Condition variable**: Use a condition variable to implement the wait-and-notify mechanism between threads.

### Example code

#### Go implementation

```go
package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

const BufferSize = 10

var buffer = make(chan int, BufferSize)

func producer(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	for i := 0; i < 5; i++ {
		item := rand.Intn(100)
		buffer <- item
		fmt.Printf("Producer %d produced item: %d\n", id, item)
		time.Sleep(time.Millisecond * 100)
	}
}

func consumer(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	for i := 0; i < 5; i++ {
		item := <-buffer
		fmt.Printf("Consumer %d consumed item: %d\n", id, item)
		time.Sleep(time.Millisecond * 150)
	}
}

func main() {
	var wg sync.WaitGroup

	// Start producers
	for i := 1; i <= 2; i++ {
		wg.Add(1)
		go producer(i, &wg)
	}

	// Start consumers
	for i := 1; i <= 2; i++ {
		wg.Add(1)
		go consumer(i, &wg)
	}

	wg.Wait()
}
```

#### C++ implementation

```cpp
#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <cstdlib>
#include <ctime>

std::queue<int> buffer;
const unsigned int BufferSize = 10;
std::mutex mtx;
std::condition_variable cv;

void producer(int id) {
    std::srand(std::time(nullptr));
    for (int i = 0; i < 5; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return buffer.size() < BufferSize; });
        int item = std::rand() % 100;
        buffer.push(item);
        std::cout << "Producer " << id << " produced item: " << item << std::endl;
        lock.unlock();
        cv.notify_all();
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

void consumer(int id) {
    for (int i = 0; i < 5; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return !buffer.empty(); });
        int item = buffer.front();
        buffer.pop();
        std::cout << "Consumer " << id << " consumed item: " << item << std::endl;
        lock.unlock();
        cv.notify_all();
        std::this_thread::sleep_for(std::chrono::milliseconds(150));
    }
}

int main() {
    std::thread producers[2], consumers[2];

    // Start producer threads
    for (int i = 0; i < 2; ++i) {
        producers[i] = std::thread(producer, i + 1);
    }

    // Start consumer threads
    for (int i = 0; i < 2; ++i) {
        consumers[i] = std::thread(consumer, i + 1);
    }

    for (int i = 0; i < 2; ++i) {
        producers[i].join();
        consumers[i].join();
    }

    return 0;
}
```

### Conclusion
The Producer-Consumer pattern is a common concurrent design pattern suitable for scenarios that require coordinating the relationship between producers and consumers in a multi-threaded environment. Through buffers and synchronization mechanisms, it effectively resolves speed differences between producers and consumers and ensures thread safety.

## Sources

- [Wikipedia · Producer–consumer problem](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem)
- [Java · BlockingQueue](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html) (standard library form, [S19])

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [thread-pool](thread-pool.md)
- [work-stealing](work-stealing.md)
- [bulkhead](/evolution/bulkhead.md)
- [glossary](/glossary.md)
- [message-channel](/integration/message-channel.md)
- [overview](/integration/overview.md)
- [publish-subscribe](/integration/publish-subscribe.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [official-docs](/research/official-docs.md)
