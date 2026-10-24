# Repository and Unit of Work

The Repository inserts a layer of mediation between the domain layer and data mapping: the domain layer holds a collection-like interface for storing and retrieving aggregate roots, knowing nothing at all about SQL, tables, or ORM. It comes from Fowler's *Patterns of Enterprise Application Architecture* [S5], and Evans binds it to aggregates in *Domain-Driven Design* [S11] — one repository per aggregate, and external code obtains aggregate roots only through the repository, never bypassing the root to change the aggregate's internal child objects. The Unit of Work tracks every change to the objects loaded within one business transaction and, on commit, coordinates the whole batch into a single database transaction; it likewise comes from [S5].

Site-wide stance (the division of labor with the [ORM chapter](/other/orm), and a precondition for this chapter holding):

- **ORM manages "how one row becomes one object"**: field mapping between tables and objects, SQL generation, session management — this is data source layer technology.
- **The Repository manages "how the domain layer gets an aggregate"**: the interface is defined in the domain layer, the implementation lands in the infrastructure layer, and the operational semantics are the whole aggregate rather than a table row. Interface in the domain layer, implementation in the infrastructure layer — this is where dependency inversion lands in persistence.

## Mechanism

Three layers of responsibility, with dependencies pointing inward only:

```
Application service ──calls──► Domain layer interface (UserRepository)
                                   ▲
                                   │ implementation (injected via DI)
              Infrastructure layer implementation (uses ORM or SQL internally)
```

- **Domain layer**: defines the `UserRepository` interface and the `User` aggregate, importing no storage packages.
- **Infrastructure layer**: implements the interface with ORM or raw SQL, injected at construction.
- **Application service**: draws the transaction boundary and orchestrates "load aggregate → change business rules → commit".

The Repository's semantics are those of a collection: `Add`, `Remove`, `ByID` — persistent aggregates are manipulated the way in-memory collections are.

The Unit of Work supplies the other half: a single business transaction often changes several aggregates, so who guarantees that "this batch of changes either all land or none land"? The Repository only handles storing and retrieving a single aggregate, while the Unit of Work registers three kinds of changes — added, modified, deleted — in memory; at `Commit` it orders the registered changes by dependency and wraps them in a single database transaction to execute. JPA's `EntityManager` persistence context and Hibernate's `Session` are its standard implementations — the framework does the registration and commit for you.

## Applicable and inapplicable

Applicable:

1. The domain model is complex and aggregate boundaries are clear — the Repository protects aggregate invariants; without aggregates there is first no repository.
2. Business rules need to be tested in isolation from storage technology — the domain layer is tested against the interface, with an in-memory stand-in as the implementation.
3. Multiple data sources, or an expected change of storage technology — swap the implementation without touching the domain layer.

Inapplicable in three cases:

1. CRUD/report-style applications: there are no domain rules to speak of; a transaction script with direct ORM is shorter, and bolting on a Repository is adding a flange to a pipe.
2. Simple read models: reports and list pages query the read side directly — do not force queries into a repository sliced by aggregate.
3. You use [Transaction Script](/other/transaction-script) and do not intend to move to a domain model: two routes, pick one.

## Relationship to other patterns

- With the [ORM chapter](/other/orm): ORM (the data mapper) is a common foundation for Repository implementations, but the Repository is not a synonym for ORM — without ORM you can still implement a Repository with raw SQL.
- With [Transaction Script](/other/transaction-script): transaction script grabs the data source directly and writes along the flow — the right answer for simple business logic; a domain model plus Repository is the route for complex business logic, and the two are counterparts.
- With [Dependency Injection](/structural/dependency-injection): the mechanism by which the Repository interface is realized — the domain layer does not `new` the implementation, which is injected via the constructor.
- Difference from DAO: DAO abstracts "storing and retrieving one table" and returns table rows; the Repository abstracts "storing and retrieving one aggregate" and returns the whole aggregate. DAO is a data source layer term, the Repository a domain layer term.
- With [Anemic Domain Model](/anti-patterns/anemic-domain-model): pair a model without domain behavior with a Repository and the Repository degenerates into a renamed DAO — there must be a domain model first before the Repository has any meaning.
- DDD's Specification works together with the Repository to compose complex query conditions; this site does not yet treat it as a standalone chapter — see the [difference table](/research/coverage) for the reason.

## Three disciplines for interface design

1. **Slice by aggregate, not by table**: one repository per aggregate root. When `OrderItemRepository` appears in a repository interface, first go back and check whether the aggregate boundary was cut wrong.
2. **Do not let the interface get fat**: add query methods as needed; for complex queries open a query service on the read side, and do not grow a general-purpose query DSL onto the Repository — that is just moving SQL into the domain layer in a different skin.
3. **Put the transaction boundary in the application layer**: repository methods do not open transactions internally; "which changes count as one commit" is decided by the application service or the Unit of Work, while the Repository only stores and retrieves a single aggregate.

## Example

Go implementation: the interface is in the domain layer, the implementation in the infrastructure layer.

```go
// domain/user.go —— Domain layer: aggregate and interface, imports no storage packages
package domain

import "context"

type User struct {
	ID    int64
	Name  string
	Email string
}

func (u *User) Rename(name string) error {
	if name == "" {
		return errors.New("empty name")
	}
	u.Name = name
	return nil
}

type UserRepository interface {
	ByID(ctx context.Context, id int64) (*User, error)
	Save(ctx context.Context, u *User) error
}
```

```go
// infra/postgres.go —— Infrastructure layer: implementation uses ORM or SQL internally
package infra

import (
	"context"
	"database/sql"

	"example.com/app/domain"
)

type UserRepo struct{ db *sql.DB }

func (r *UserRepo) ByID(ctx context.Context, id int64) (*domain.User, error) {
	var u domain.User
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, email FROM users WHERE id = $1`, id,
	).Scan(&u.ID, &u.Name, &u.Email)
	return &u, err
}

func (r *UserRepo) Save(ctx context.Context, u *domain.User) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE users SET name = $1, email = $2 WHERE id = $3`,
		u.Name, u.Email, u.ID,
	)
	return err
}
```

The application service draws the transaction boundary, with the Repository and Unit of Work working together — two aggregates changed within the same business transaction, landing in one database transaction:

```go
// app/service.go —— Application service: orchestration and transaction boundary
func (s *UserService) Rename(ctx context.Context, uid int64, name string) error {
	u, err := s.users.ByID(ctx, uid) // 1. Load the aggregate
	if err != nil {
		return err
	}
	if err := u.Rename(name); err != nil { // 2. Apply the domain rule
		return err
	}
	return s.uow.Commit(ctx, u) // 3. The Unit of Work wraps the whole batch into one transaction
}
```

How the Unit of Work is used in tests: domain layer tests inject an in-memory implementation (`map[int64]*User`), so business rules never touch the database.

No need to write this yourself on the Java side: Spring Data JPA's `Repository` (an interface plus queries derived from method names, with `findByEmail` generating the SQL automatically) is the standard implementation of the Repository; JPA's `EntityManager` persistence context and Hibernate's `Session` are the Unit of Work — `persist` and `merge` are the registration, and the database is flushed in one go when the transaction commits.

## Three small things when adopting it

1. **Aggregates first, then repositories**: when you cannot tell where the aggregate boundaries are in your model, do not introduce a Repository yet — what you bolt on is just a renamed DAO.
2. **Test stand-ins must be real**: the in-memory implementation's semantics have to match the real implementation (the same interface, the same error shapes), or tests go green and production breaks.
3. **Do not let DTOs come out of the Repository**: the Repository returns domain objects; if the interface layer needs fields trimmed, do it in the interface layer, and do not pollute the domain layer's interface signatures.

## Related articles

- [Object-Relational Mapping (ORM)](/other/orm): a common foundation for Repository implementations, and the table↔object mapping itself.
- [Transaction Script](/other/transaction-script): the other route for simple business logic, a counterpart to this chapter.
- [Dependency Injection](/structural/dependency-injection): the mechanism that decouples interface from implementation.
- [Anemic Domain Model](/anti-patterns/anemic-domain-model): the cautionary case of a Repository degenerating into a DAO when there is no domain behavior.

## Sources

- [S5] Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002. The original source of the Repository and Unit of Work.
- [S11] Eric Evans, *Domain-Driven Design*, Addison-Wesley, 2003. The stance of binding the Repository to aggregates.

<!-- BACKLINKS-AUTO -->
## Related pages

- [overview](/evolution/overview.md)
- [glossary](/glossary.md)
- [overview](overview.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
- [remote-facade](/structural/remote-facade.md)
