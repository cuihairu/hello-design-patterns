# Golden Hammer

A Golden Hammer is "I have a technology that feels comfortable in hand, so every problem gets solved with it." The *AntiPatterns* book lists it as one of the most common technology anti-patterns [S7], characterized by technology choices being driven by familiarity rather than by the problem.

## Shape

1. In the team's technology proposal documents, one technology appears in every column, including scenarios that clearly do not fit.
2. When asked "why use it," the answer is "we know it well" or "we did it this way before," with no comparison aimed at this scenario.
3. When a new constraint appears in the requirements (strong consistency, offline, embedded size), the first thought is how to make the existing technology do it, not whether to switch technologies.
4. Introducing a new technology requires three pages of justification, but keeping the existing one requires no justification at all.

Every team has preferred technologies; the line between a healthy preference and a Golden Hammer is whether you can re-evaluate when a mismatch signal appears. Signals include large hand-written logic that bypasses the framework's capabilities in the code, configuration items outnumbering business code lines, or newcomers having to learn a homegrown abstraction before they can touch the business.

## Cost

- In mismatched scenarios, abstraction leaks require long-term patching: places the framework cannot reach need escape hatches, and those escape hatches eventually become the main road.
- Solution cost is underestimated: it looks like "reusing existing capabilities," but in reality you are reshaping the new problem into a form the old tool can handle, and nobody counts that reshaping work.
- Hiring and maintenance cost rises with time: the narrower the stack, the fewer people can take over.
- Single point of dependency: upgrading this tool's version drags every business along.

## Causes

1. **Success-path dependency**: the last project succeeded with it, and the team treats "last time's solution" as "this kind of problem's solution."
2. **Evaluation happens only once**: selection was compared carefully once, then new scenarios just inherit it, never re-running the evaluation.
3. **Sunk cost**: a pile of libraries and tools have already been built, and switching technology means those assets go to waste, so more features get fed to it.

## Getting out

1. **Keep the ledger first**: list the scenarios where the current technology is being force-fit, and for each note "what extra work was done to use it." A technology switch discussion without this step becomes a religion war.
2. **Cut the smallest slice**: pick one scenario with high change frequency and small scale to replace, keep the original technology untouched elsewhere, and let the comparison results speak.
3. **Leave a rollback path**: during the coexistence period, write the boundary into interfaces; do not let the two sides import each other.
4. **Write the evaluation into a gate**: afterwards new scenarios go through this gate, answering "what are the constraints, and which constraint does this technology fail to meet" before deciding to keep it.

Switching technology is not the goal; making selection tied to constraints again is.

## Example

Anti-pattern: to avoid introducing a rules engine, discount rules are written as configuration-driven string expressions, then a custom evaluator is implemented from scratch.

```python
class Pricing:
    def __init__(self, rules: list[str]):
        self.rules = rules          # rules are strings like "qty>10 and vip"

    def discount(self, order) -> float:
        total = 0.0
        for rule in self.rules:
            if self._eval(rule, order):     # a homegrown evaluator must handle precedence, escaping, and short-circuiting
                total += 5.0
        return total

    def _eval(self, expr, order) -> bool:
        # hand-written parsing: precedence, parentheses, and error messages all come from you, and it keeps becoming half a language
        ...
```

The real problem here is "rules change frequently and are edited by the business side." Pick the tool by the problem: either use an existing rules engine, or express rules in code and release them through deployment:

```python
from dataclasses import dataclass
from typing import Callable

Rule = Callable[["Order"], bool]

def qty_over(n: int) -> Rule:
    return lambda o: o.qty > n

def all_of(*rules: Rule) -> Rule:
    return lambda o: all(r(o) for r in rules)

@dataclass
class Pricing:
    rules: list[Rule]

    def discount(self, order) -> float:
        return 5.0 if all_of(*self.rules)(order) else 0.0
```

Rules become testable functions, and precedence, error messages, and parsing no longer need to be built by you. If you really need the business side to edit rules online later, just swap the rule source to an existing engine; the change is confined to where `Pricing` is constructed.

## Related readings

- [Strategy](/behavioral/strategy): making "swap the algorithm" into "swap the object" is the first step against a Golden Hammer.
- [Adapter](/structural/adapter): when something is already bolted on and cannot be removed short-term, use an adapter to wall the mismatched interface off at the boundary.
- [Dependency Injection](/structural/dependency-injection): hide concrete technology behind constructor parameters so that swapping implementations only touches the wiring site.

## Sources

- [S7] Brown et al., *AntiPatterns*, Wiley, 1998.
- [S17] SourceMaking's AntiPatterns entry, used as a structural reference for the shape and cost sections.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](overview.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
