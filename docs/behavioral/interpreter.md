# Interpreter

The Interpreter pattern is a behavioral design pattern that defines a representation for a language's grammar and uses that representation to interpret sentences in the language. This pattern is commonly used to design and implement domain-specific languages (DSLs) or expression evaluators.

### Components of the Interpreter pattern

1. **Abstract Expression (Abstract Expression)**: Declares an interpret operation interface.
2. **Terminal Expression (Terminal Expression)**: Implements the interpret operation associated with a terminal in the grammar.
3. **Non-Terminal Expression (Non-Terminal Expression)**: Implements the interpret operation associated with a non-terminal in the grammar, typically containing references to other expressions.
4. **Context (Context)**: Contains some global information outside the interpreter.
5. **Client (Client)**: Builds the syntax tree and invokes interpret operations.

### Advantages of the Interpreter pattern

1. **Simple grammar parsing**: Provides an interpreter framework for simple grammars, easy to implement.
2. **Easy to extend**: Extends new grammar rules by adding new expression classes.

### Disadvantages of the Interpreter pattern

1. **Complexity**: When the grammar is complex, the number of expression classes increases sharply, making maintenance difficult.
2. **Performance issues**: Interpret operations may be time-consuming, especially when the grammar is complex.

### Use cases

1. **A specific domain has a simple grammar that needs to be interpreted and executed.**
2. **Grammar rules are stable and relatively simple scenarios.**

### Example code

#### C++ implementation

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

// Abstract expression
class Expression {
public:
    virtual ~Expression() = default;
    virtual int interpret(const std::unordered_map<std::string, int>& context) = 0;
};

// Terminal expression
class Number : public Expression {
public:
    Number(int value) : value(value) {}
    int interpret(const std::unordered_map<std::string, int>& context) override {
        return value;
    }
private:
    int value;
};

// Non-terminal expression
class Add : public Expression {
public:
    Add(std::unique_ptr<Expression> left, std::unique_ptr<Expression> right)
        : left(std::move(left)), right(std::move(right)) {}
    int interpret(const std::unordered_map<std::string, int>& context) override {
        return left->interpret(context) + right->interpret(context);
    }
private:
    std::unique_ptr<Expression> left;
    std::unique_ptr<Expression> right;
};

// Non-terminal expression
class Subtract : public Expression {
public:
    Subtract(std::unique_ptr<Expression> left, std::unique_ptr<Expression> right)
        : left(std::move(left)), right(std::move(right)) {}
    int interpret(const std::unordered_map<std::string, int>& context) override {
        return left->interpret(context) - right->interpret(context);
    }
private:
    std::unique_ptr<Expression> left;
    std::unique_ptr<Expression> right;
};

int main() {
    std::unordered_map<std::string, int> context;

    // Represents 10 + (5 - 2)
    std::unique_ptr<Expression> expression = std::make_unique<Add>(
        std::make_unique<Number>(10),
        std::make_unique<Subtract>(
            std::make_unique<Number>(5),
            std::make_unique<Number>(2)
        )
    );

    std::cout << "Result: " << expression->interpret(context) << std::endl;

    return 0;
}
```

#### Go implementation

```go
package main

import "fmt"

// Expression interface
type Expression interface {
	Interpret(context map[string]int) int
}

// Number terminal expression
type Number struct {
	value int
}

func (n *Number) Interpret(context map[string]int) int {
	return n.value
}

// Add non-terminal expression
type Add struct {
	left, right Expression
}

func (a *Add) Interpret(context map[string]int) int {
	return a.left.Interpret(context) + a.right.Interpret(context)
}

// Subtract non-terminal expression
type Subtract struct {
	left, right Expression
}

func (s *Subtract) Interpret(context map[string]int) int {
	return s.left.Interpret(context) - s.right.Interpret(context)
}

func main() {
	context := make(map[string]int)

	// Represents 10 + (5 - 2)
	expression := &Add{
		left: &Number{value: 10},
		right: &Subtract{
			left:  &Number{value: 5},
			right: &Number{value: 2},
		},
	}

	fmt.Println("Result:", expression.Interpret(context))
}
```

#### Java implementation

```java
import java.util.Map;

// Abstract expression
interface Expression {
    int interpret(Map<String, Integer> context);
}

// Terminal expression
class Number implements Expression {
    private int value;

    public Number(int value) {
        this.value = value;
    }

    @Override
    public int interpret(Map<String, Integer> context) {
        return value;
    }
}

// Non-terminal expression
class Add implements Expression {
    private Expression left;
    private Expression right;

    public Add(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public int interpret(Map<String, Integer> context) {
        return left.interpret(context) + right.interpret(context);
    }
}

// Non-terminal expression
class Subtract implements Expression {
    private Expression left;
    private Expression right;

    public Subtract(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public int interpret(Map<String, Integer> context) {
        return left.interpret(context) - right.interpret(context);
    }
}

public class InterpreterPatternDemo {
    public static void main(String[] args) {
        Map<String, Integer> context = Map.of();

        // Represents 10 + (5 - 2)
        Expression expression = new Add(
            new Number(10),
            new Subtract(
                new Number(5),
                new Number(2)
            )
        );

        System.out.println("Result: " + expression.interpret(context));
    }
}
```

### Summary of advantages and disadvantages

#### Advantages

1. **Simple grammar parsing**: Provides an interpreter framework for simple grammars, easy to implement.
2. **Easy to extend**: Extends new grammar rules by adding new expression classes.
3. **Flexibility**: Can change grammar rules and the implementation of expressions.

#### Disadvantages

1. **Complexity**: When the grammar is complex, the number of expression classes increases sharply, making maintenance difficult.
2. **Performance issues**: Interpret operations may be time-consuming, especially when the grammar is complex.

The Interpreter pattern can effectively parse and execute simple grammars in a specific domain in real development, and is a very useful design pattern, especially in scenarios where grammar rules need to be frequently changed and extended.

## Sources

- [S1] GoF behavioral catalog (Chapter 5), the original source of this pattern.
- [Wikipedia · Interpreter pattern](https://en.wikipedia.org/wiki/Interpreter_pattern) (Not covered by Refactoring.Guru)

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
