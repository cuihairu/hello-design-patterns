# Spaghetti Code

Spaghetti code means control flow has lost its structure: logic is chained together through layers of jumps, shared variables, and implicit ordering, so reading it requires manually simulating execution to know whether a given line will run at all. It is one of the architectural entries in *AntiPatterns* [S7], and it is the form that novice code and "get it running first" code most often lands in.

## Shape

1. **Runaway function length**: a single function runs hundreds of lines, with seven or eight `return` statements in the middle and several exit markers that jump outside the function.
2. **Scattered state**: the variables a decision depends on come from parameters, member fields, global variables, and leftovers from the previous call; when any one of them changes, behavior changes.
3. **Order-sensitive**: A must be called before B, and swapping them breaks things, but that order is written only in a comment from one commit.
4. **Exceptions swallowed**: the `catch` block holds only a comment or a log line, and the error bubbles up to become a "sporadic issue."
5. **Tests by click**: automated cases do not cover the main path, and regression relies on a human clicking through the UI.

## Cost

- Reading cost far exceeds writing cost: a 300-line function takes a newcomer half an hour to read, and changing 5 lines means reading it all over again.
- Changes cannot be localized: there is no place that can be called "the boundary of this logic," so the regression range can only be estimated by module.
- Concurrency will always blow up: there is a lot of shared mutable state, so locking can only cover the whole function and throughput drops; skip the lock and you get a race.
- Debugging depends on logs: reproducing a problem requires on-site logs, because the code itself cannot statically reveal the execution path.

## Causes

1. **Debug-style writing**: write half of it, add `if` statements as it runs, and use branches as debug switches.
2. **Copy-and-extend**: copy a chunk from somewhere else and tweak a few lines; from then on the two copies' boundary conditions diverge.
3. **Refactoring nobody dares to do**: without test protection, changing the structure is riskier than adding a branch, so the structure only gets worse.
4. **Premature optimization reflex**: treating an optimized inline style as the default style, with no measurement of the readability cost traded away.

## Getting out

Use techniques for what can be done at once, and order for what cannot:

1. **Set up tests first**: pick the most core path and pin the existing behavior with end-to-end cases (including behaviors that look like bugs). Without this step, every later step is a blind change.
2. **Split long functions**: cut by "do one thing" into private methods, without changing any logic, only structure. After cutting, look at the parameter lists; if parameters exceed three, a group of data should be gathered into a struct.
3. **Collect the state**: gather scattered mutable variables into a struct, or into an explicit context object that the function only reads.
4. **Write the order down**: pull a multi-step flow into sequential calls inside one method, or express it explicitly with [Chain of Responsibility](/behavioral/chain-of-responsibility), so the order is visible in the types.
5. **Make error paths explicit**: return an error when you can, and do not rely on global flag variables; errors crossing layers go through one layer uniformly, and the semantics of cancel and interrupt reference [Command](/behavioral/command).

Do not start step 2 before step 1 is finished, or you will not be able to tell which regressions the refactoring introduced.

## Example

Anti-pattern: an order-placement flow that advances by way of a shared flag and implicit ordering.

```python
_ok = False            # module-level mutable state, anyone can change it
_orders = []

def process(order):
    global _ok
    try:
        reserve(order)                 # reserve inventory
        _ok = True
    except Exception:
        _ok = False
    if _ok:
        charge(order)                  # charge; on failure inventory is not rolled back
        _ok = True
    if _ok:
        _orders.append(order)          # record the order
        notify(order)
    # after reserve fails, charge's branch is not taken, but after charge fails notify is taken:
    # charging fails yet the order is still shipped — issues like this can only be found in production
```

After refactoring: state is collected into one object, the order is written in one place, and failure branches return explicitly.

```python
@dataclass
class OrderResult:
    ok: bool
    reason: str = ""

class OrderProcessor:
    def process(self, order) -> OrderResult:
        if not self.inventory.reserve(order):
            return OrderResult(False, "Insufficient stock")
        if not self.payments.charge(order):
            self.inventory.release(order)      # the failure path gives back the reserved inventory
            return OrderResult(False, "Payment deduction failed")
        self.store.save(order)
        return OrderResult(True)
```

Every step's failure returns explicitly, the inverse operation is written at the failure site, and the flow order lives in one method. Tests can inject a fake `inventory` and `payments` directly into `OrderProcessor`.

## Related readings

- [Strategy](/behavioral/strategy): pulling nested conditional branches into a replaceable algorithm object is the most commonly used cut when dealing with spaghetti.
- [Command](/behavioral/command): after wrapping "what to do" in an object, undo, retry, and logging can all hang off it.
- [Template Method](/behavioral/template-method): fixes the skeleton of a multi-step flow so each step is individually testable.
- [Big Ball of Mud](/anti-patterns/big-ball-of-mud): loss of control in a single function and loss of control across the whole system.

## Sources

- [S7] Brown et al., *AntiPatterns*, Wiley, 1998, the Spaghetti Code entry.
- [S17] SourceMaking's corresponding entry, used as a reference for the shape section.
- [S6] *Refactoring*, 2nd edition, refactoring techniques for long functions and duplicated code.

<!-- BACKLINKS-AUTO -->
## Related pages

- [anemic-domain-model](anemic-domain-model.md)
- [big-ball-of-mud](big-ball-of-mud.md)
- [overview](overview.md)
- [solid](/evolution/solid.md)
- [glossary](/glossary.md)
- [transaction-script](/other/transaction-script.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
