# Big Ball of Mud

A Big Ball of Mud describes a system that is already in production, runs fine, but has no main architecture: features get stacked on with patches, data gets worked around with copies, and nobody can say what will break if you change something. It comes from Foote and Yoder's PLoP 1997 paper [S8], whose conclusion is somewhat counterintuitive: most systems end up looking like this, and often because delivering this way is fastest.

## Shape

1. **No describable structure**: ask "how many layers does this system have" and the answer is "just look at the folders."
2. **Duplication is the norm**: the same piece of business logic has a copy in two or three places, and you fix one and forget the other two.
3. **Data has multiple sources of truth**: the same data lives in two tables plus an export file, and which one counts depends on the time of day.
4. **Side doors outnumber the front entrance**: to avoid touching the core code, new features go through back-channel interfaces, scheduled jobs, and manual scripts.
5. **Changes rely on human memory**: nobody dares to automate regression, because everyone knows "there is a special case somewhere," but cannot say where.

The paper's criterion is outcome-oriented: structure does not matter, whether it can be understood and changed does. A system with no layers but a team that can quickly change it correctly is not a Big Ball of Mud; one with a layer diagram but five places to sync-change for every edit is.

## Cost

- The cost of new requirements rises linearly with time: every requirement first spends half its time confirming it will not touch anything else.
- A high proportion of fixes introduce new defects: without regression protection, the interactions between patches can only be discovered after going live.
- Key-person dependency: the system's invariants live in a few veterans' heads, not in the code.
- The refactoring budget grows the longer you wait: the later you start, the more you can only keep stacking patches.

## Causes

The path the paper records is mostly consistent:

1. **Ship first, tidy later**: the demo becomes the production version, and temporary solutions become permanent structure.
2. **The temptation to reuse**: to save one engineering round-trip, a new feature is wired onto the old data model, with views and copies papering over the mismatch.
3. **Giving up on tidying**: when one change requires ten places to move, the team chooses to go around, and the structure fragments further.
4. **Harmless neglect**: the system runs, nobody complains, so nobody greenlights a "tidy up" project.

## Getting out

The strategy the paper gives is strangulation rather than rewrite (the Strangler idea is repeatedly cited in later microservices practice [S13]):

1. **Draw a boundary**: pick one business slice that can run independently (a page, one reconciliation chain), list its entry points, data, and callers, and leave the rest untouched.
2. **Set up anti-corruption**: let new and old code talk to each other only through one explicit interface; the old field names must not leak into the new layer — this layer is the embryo of bounded contexts above and below [S11].
3. **Move without changing logic**: first move the logic as-is into the new structure, get it running and add regression tests, then talk about rewriting. Mixing moving and rewriting makes it impossible to tell who introduced the regression.
4. **Close off slice by slice**: each slice is independently stoppable, and slices do not depend on each other; once the third is done you can stop for a quarter and just maintain.
5. **Set an expiry date for "side doors"**: register back-channel interfaces and manual scripts, noting who introduced them and when they will be removed.

The discouraged approach is a one-shot rewrite: the un-written special cases inside a Big Ball of Mud get fixed as bugs during the rewrite, and then you discover in production that they were requirements.

## Example

The same thing written in the mud and in a slice:

```python
# Mud: three entry points each have a copy of the reconciliation logic, with different parameter formats
def reconcile_web(user_id, date):
    rows = db.query(f"SELECT * FROM orders WHERE user={user_id} AND day='{date}'")
    paid = sum(r.amount for r in rows if r.status in ("paid", "refunded", "manual_ok"))
    ...

def reconcile_job(batch):           # scheduled job version, with one extra branch in the status check
    ...
def reconcile_fix():                # manual fix script, yet a third copy
    ...
```

The slice version collects the invariant into one place; the entry points only fetch data:

```python
class Reconciliation:
    STATUSES = ("paid", "refunded", "manual_ok")

    def net_amount(self, orders) -> float:
        return sum(o.amount for o in orders if o.status in self.STATUSES)

def reconcile_web(user_id, date):
    return Reconciliation().net_amount(fetch_orders(user_id, date))

def reconcile_job(batch):
    return Reconciliation().net_amount(fetch_orders_batch(batch))
```

The three entry points still fetch data their own way, but "which statuses count as settled" has only one definition. Do this layer of convergence first, then talk about unifying how data is fetched.

## Related readings

- [God Object](/anti-patterns/god-object): loss of control at the class level, often part of system-level loss of control.
- [Spaghetti Code](/anti-patterns/spaghetti-code): loss of control at the control-flow level.
- [Event Sourcing](/other/event-sourcing): when "which copy of the data counts" is the main pain point, taking the change history as the source of truth is one way out.

## Sources

- [S8] Brian Foote, Joseph Yoder, *Big Ball of Mud*, PLoP 1997.
- [S11] Eric Evans, *Domain-Driven Design*, 2003, bounded contexts and anti-corruption layers.
- [S13] Chris Richardson, *Microservices Patterns*, 2018, the practical source for strangler migrations.

<!-- BACKLINKS-AUTO -->
## Related pages

- [god-object](god-object.md)
- [overview](overview.md)
- [spaghetti-code](spaghetti-code.md)
- [glossary](/glossary.md)
- [reference](/reference.md)
- [coverage](/research/coverage.md)
