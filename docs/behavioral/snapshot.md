### 快照模式（Snapshot Pattern）

快照模式（Snapshot Pattern），也被称为备忘录模式（Memento Pattern），是一种行为设计模式。它的主要目的是在不破坏封装性的前提下，捕获并保存对象的内部状态，以便稍后将对象恢复到之前的状态。

### 主要用途
1. **状态恢复**：允许在需要时恢复对象到之前的某个状态。例如，实现撤销/重做功能。
2. **保存检查点**：在复杂操作中创建检查点，可以在操作失败时回退到检查点状态。
3. **实现历史记录**：保存对象的历史状态，以便可以随时查看或恢复。

### 参与者
1. **Originator**：原发器，负责创建快照，并在需要时从快照中恢复状态。
2. **Memento**：快照，保存了原发器的内部状态。
3. **Caretaker**：管理者，负责保存和恢复快照，但不能修改快照的内容。

### 优点
- **封装性**：保存和恢复状态时，不暴露对象的内部实现细节。
- **简化操作**：允许简单地保存和恢复对象状态，实现复杂的撤销/重做操作。

### 缺点
- **内存消耗**：如果对象状态很大或需要频繁保存快照，会消耗大量内存。
- **实现复杂性**：需要维护快照的创建和恢复逻辑，增加了实现的复杂性。

### 具体实现示例

#### Java实现

```java
// Originator
class TextEditor {
    private StringBuilder text;

    public TextEditor() {
        text = new StringBuilder();
    }

    public void write(String words) {
        text.append(words);
    }

    public String read() {
        return text.toString();
    }

    public Snapshot save() {
        return new Snapshot(text.toString());
    }

    public void restore(Snapshot snapshot) {
        text = new StringBuilder(snapshot.getText());
    }
}

// Memento
class Snapshot {
    private final String text;

    public Snapshot(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}

// Caretaker
class SnapshotManager {
    private final List<Snapshot> snapshots = new ArrayList<>();

    public void saveSnapshot(Snapshot snapshot) {
        snapshots.add(snapshot);
    }

    public Snapshot getSnapshot(int index) {
        return snapshots.get(index);
    }
}

// 客户端代码
public class SnapshotPatternDemo {
    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        SnapshotManager manager = new SnapshotManager();

        editor.write("Hello, world!");
        manager.saveSnapshot(editor.save());

        editor.write(" Welcome to the snapshot pattern.");
        manager.saveSnapshot(editor.save());

        System.out.println("Current text: " + editor.read());

        editor.restore(manager.getSnapshot(0));
        System.out.println("After restoring: " + editor.read());
    }
}
```

#### C++实现

```cpp
#include <iostream>
#include <vector>
#include <string>

// Memento
class Snapshot {
public:
    Snapshot(const std::string& text) : text_(text) {}

    std::string getText() const {
        return text_;
    }

private:
    std::string text_;
};

// Originator
class TextEditor {
public:
    void write(const std::string& words) {
        text_ += words;
    }

    std::string read() const {
        return text_;
    }

    Snapshot save() const {
        return Snapshot(text_);
    }

    void restore(const Snapshot& snapshot) {
        text_ = snapshot.getText();
    }

private:
    std::string text_;
};

// Caretaker
class SnapshotManager {
public:
    void saveSnapshot(const Snapshot& snapshot) {
        snapshots_.push_back(snapshot);
    }

    Snapshot getSnapshot(size_t index) const {
        return snapshots_[index];
    }

private:
    std::vector<Snapshot> snapshots_;
};

// 客户端代码
int main() {
    TextEditor editor;
    SnapshotManager manager;

    editor.write("Hello, world!");
    manager.saveSnapshot(editor.save());

    editor.write(" Welcome to the snapshot pattern.");
    manager.saveSnapshot(editor.save());

    std::cout << "Current text: " << editor.read() << std::endl;

    editor.restore(manager.getSnapshot(0));
    std::cout << "After restoring: " << editor.read() << std::endl;

    return 0;
}
```

#### Python实现

```python
# Memento
class Snapshot:
    def __init__(self, text):
        self._text = text

    def get_text(self):
        return self._text

# Originator
class TextEditor:
    def __init__(self):
        self._text = ""

    def write(self, words):
        self._text += words

    def read(self):
        return self._text

    def save(self):
        return Snapshot(self._text)

    def restore(self, snapshot):
        self._text = snapshot.get_text()

# Caretaker
class SnapshotManager:
    def __init__(self):
        self._snapshots = []

    def save_snapshot(self, snapshot):
        self._snapshots.append(snapshot)

    def get_snapshot(self, index):
        return self._snapshots[index]

# 客户端代码
if __name__ == "__main__":
    editor = TextEditor()
    manager = SnapshotManager()

    editor.write("Hello, world!")
    manager.save_snapshot(editor.save())

    editor.write(" Welcome to the snapshot pattern.")
    manager.save_snapshot(editor.save())

    print("Current text:", editor.read())

    editor.restore(manager.get_snapshot(0))
    print("After restoring:", editor.read())
```

这些示例展示了如何使用快照模式捕获和恢复对象状态，从而实现诸如撤销/重做等功能。