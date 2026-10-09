# 仓储与单元工作（Repository and Unit of Work）

仓储在领域层与数据映射之间加了一层中介：领域层拿着一个"像集合"的接口存取聚合根，完全不知道 SQL、表和 ORM 的存在。它出自 Fowler 的《企业应用架构模式》[S5]，Evans 在《领域驱动设计》[S11] 里把它绑到聚合上——一个聚合一个仓储，外部只通过仓储拿聚合根，不许绕开根去改聚合内部的子对象。单元工作跟踪一次业务事务里取出的所有对象改动，提交时把整批改动协调成一个数据库事务落库，同样出自 [S5]。

站内口径（与 [ORM 篇](/other/orm)的分工，也是这一篇成立的前提）：

- **ORM 管"一行怎么变成一个对象"**：表与对象之间的字段映射、SQL 生成、会话管理，是数据源层的技术。
- **仓储管"领域层怎么拿聚合"**：接口定义在领域层，实现落在基础设施层，操作语义是聚合整体而不是表行。接口在领域层、实现在基础设施层，这条线是依赖倒置在持久化上的落点。

## 机制

三层分工，依赖单向朝里：

```
应用服务 ──调用──► 领域层接口（UserRepository）
                        ▲
                        │ 实现（依赖注入进来）
              基础设施层实现（内部用 ORM 或 SQL）
```

- **领域层**：定义 `UserRepository` 接口和聚合 `User`，不 import 任何存储包。
- **基础设施层**：用 ORM 或裸 SQL 实现接口，构造时注入。
- **应用服务**：划事务边界，编排"取聚合 → 改业务规则 → 提交"。

仓储的语义是集合：`Add`、`Remove`、`ByID`，像操作内存集合一样操作持久化的聚合。

单元工作补另一半：一次业务事务常改动多个聚合，谁来保证"这批改动要么全落、要么全不落"？仓储只管单个聚合的存取，单元工作在内存里登记新增、修改、删除三类改动，`Commit` 时把登记的改动按依赖顺序排好，包进一个数据库事务执行。JPA 的 `EntityManager` 持久化上下文、Hibernate 的 `Session` 都是它的标准实现——框架替你做了登记与提交。

## 适用与不适用

适用于：

1. 领域模型复杂、聚合边界清晰——仓储保护聚合不变量，没有聚合就先没有仓储。
2. 需要把业务规则与存储技术隔离测试——领域层对着接口写测试，实现用内存替身。
3. 多数据源或预期更换存储技术——换实现不动领域层。

不适用的三种：

1. CRUD 报表型应用：没有领域规则可言，事务脚本加直连 ORM 更短，套仓储是给管道加法兰。
2. 简单读模型：报表、列表页直接查读侧，别把查询硬塞进按聚合切的仓储。
3. 用了[事务脚本](/other/transaction-script)且不打算迁领域模型：两条路线，选一条。

## 与其他模式的关系

- 与 [ORM 篇](/other/orm)：ORM（数据映射器）是仓储实现的常见底座，但仓储不是 ORM 的别名——没有 ORM 也可以用裸 SQL 实现仓储。
- 与[事务脚本](/other/transaction-script)：事务脚本直接拿数据源、按流程写，是简单业务的正解；领域模型加仓储是复杂业务的路线，两者互为对照。
- 与[依赖注入](/structural/dependency-injection)：仓储接口落地的机制——领域层不 new 实现，实现从构造函数注入。
- 与 DAO 的区别：DAO 抽象的是"一张表的存取"，返回表行；仓储抽象的是"一个聚合的存取"，返回聚合整体。DAO 是数据源层的词，仓储是领域层的词。
- 与[贫血模型](/anti-patterns/anemic-domain-model)：没有领域行为的模型配上仓储，仓储会退化成 DAO 改——先有领域模型，仓储才有意义。
- DDD 的规格（Specification）与仓储配套做复杂查询条件组合，本仓暂不单独成篇，理由见[差异表](/research/coverage)。

## 接口设计的三条纪律

1. **按聚合切，别按表切**：一个聚合根一个仓储。仓储接口里出现 `OrderItemRepository` 时，先回头检查聚合边界是不是切错了。
2. **接口别长胖**：查询方法按需加；要复杂查询就开读侧的查询服务，不要在仓储上长出通用查询 DSL——那等于把 SQL 换个皮搬进领域层。
3. **事务边界放应用层**：仓储方法内部不开事务；"哪些改动算一次提交"由应用服务或单元工作决定，仓储只做单聚合的存取。

## 示例

Go 实现：接口在领域层，实现在基础设施层。

```go
// domain/user.go —— 领域层：聚合与接口，不 import 任何存储包
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
// infra/postgres.go —— 基础设施层：实现内部用 ORM 或 SQL
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

应用服务划事务边界，仓储与单元工作配合——同一业务事务里改两个聚合，一个数据库事务落库：

```go
// app/service.go —— 应用服务：编排与事务边界
func (s *UserService) Rename(ctx context.Context, uid int64, name string) error {
	u, err := s.users.ByID(ctx, uid) // 1. 取聚合
	if err != nil {
		return err
	}
	if err := u.Rename(name); err != nil { // 2. 走领域规则
		return err
	}
	return s.uow.Commit(ctx, u) // 3. 单元工作把整批改动包进一个事务
}
```

单元工作在测试里的用法：领域层测试注入内存实现（`map[int64]*User`），业务规则完全不碰数据库。

Java 侧不必自己写：Spring Data JPA 的 `Repository`（接口 + 方法名派生查询，`findByEmail` 自动生成 SQL）是仓储的标准实现；JPA 的 `EntityManager` 持久化上下文与 Hibernate 的 `Session` 就是单元工作——`persist`、`merge` 是登记，事务提交时统一刷库。

## 接入时的三件小事

1. **先有聚合再有仓储**：模型里分不清聚合边界时，先别上仓储——套上去的只是 DAO 换名。
2. **测试替身要真**：内存实现的语义要和真实实现一致（同一个接口、同样的错误形态），否则测试绿了生产挂。
3. **别让 DTO 从仓储里出来**：仓储返回领域对象；接口层要裁剪字段，在接口层做，别污染领域层接口签名。

## 相关篇目

- [对象-关系映射（ORM）](/other/orm)：仓储实现的常见底座，表↔对象映射本身。
- [事务脚本模式](/other/transaction-script)：另一条简单业务路线，与本篇互为对照。
- [依赖注入模式](/structural/dependency-injection)：接口与实现解耦的机制。
- [贫血模型](/anti-patterns/anemic-domain-model)：没有领域行为时，仓储退化成 DAO 的反面教材。

## 来源

- [S5] Martin Fowler，《Patterns of Enterprise Application Architecture》，Addison-Wesley，2002。仓储与单元工作的原始出处。
- [S11] Eric Evans，《Domain-Driven Design》，Addison-Wesley，2003。仓储绑定聚合的口径。
