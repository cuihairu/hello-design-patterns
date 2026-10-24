# Object-Relational Mapping

#### Overview
Object-Relational Mapping (ORM) is a technique used to manage relational database data in object-oriented programming languages. By mapping database tables to objects and the rows in those tables to object instances, it lets developers work with the database in an object-oriented way, without having to write large amounts of SQL code.

#### Use cases
- **Data access layer**: In enterprise applications, the ORM pattern is used to implement the data access layer and simplify database operations.
- **Rapid development**: By cutting down on hand-written SQL, the ORM pattern speeds up development.
- **Cross-database**: ORM frameworks usually support multiple databases, which makes it easier to migrate an application to a different database system.

#### Advantages
- **Higher development productivity**: Automatically generating SQL statements reduces the manual effort of writing SQL.
- **Object-oriented programming**: Lets developers work with the database using a familiar object-oriented programming language.
- **Database independence**: ORM frameworks usually support multiple database systems, strengthening the application's database independence.
- **Maintainability and readability**: Makes the data access code clearer and easier to maintain.

#### Disadvantages
- **Performance overhead**: Because an ORM framework has to convert between objects and relations, it can introduce some performance overhead.
- **Complex queries**: For complex queries, hand-written SQL can be more efficient than the SQL the ORM generates automatically.
- **Learning curve**: Using an ORM framework requires learning its particular APIs and configuration approach.

#### Example code

##### Java example (using Hibernate)
Hibernate is a popular Java ORM framework.

1. Configure Hibernate (hibernate.cfg.xml):
```xml
<hibernate-configuration>
    <session-factory>
        <property name="hibernate.dialect">org.hibernate.dialect.MySQLDialect</property>
        <property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/mydatabase</property>
        <property name="hibernate.connection.username">root</property>
        <property name="hibernate.connection.password">password</property>
        <property name="hibernate.hbm2ddl.auto">update</property>
        <mapping class="com.example.User"/>
    </session-factory>
</hibernate-configuration>
```

2. Define the entity class (User.java):
```java
package com.example;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    private int id;
    private String name;
    private String email;

    // Getters and Setters
}
```

3. Use Hibernate for database operations:
```java
package com.example;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class Main {
    public static void main(String[] args) {
        Configuration configuration = new Configuration().configure();
        SessionFactory sessionFactory = configuration.buildSessionFactory();
        Session session = sessionFactory.openSession();

        session.beginTransaction();
        User user = new User();
        user.setId(1);
        user.setName("John Doe");
        user.setEmail("john.doe@example.com");
        session.save(user);
        session.getTransaction().commit();

        session.close();
        sessionFactory.close();
    }
}
```

##### Python example (using SQLAlchemy)
SQLAlchemy is a widely used Python ORM framework.

1. Install SQLAlchemy:
```bash
pip install sqlalchemy
```

2. Define the database connection and the mapping class (example.py):
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

engine = create_engine('mysql+pymysql://root:password@localhost/mydatabase')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

new_user = User(id=1, name='John Doe', email='john.doe@example.com')
session.add(new_user)
session.commit()

session.close()
```

##### C# example (using Entity Framework)
Entity Framework is a popular .NET ORM framework.

1. Install Entity Framework:
```bash
Install-Package EntityFramework
```

2. Define the entity class and the context class (Example.cs):
```csharp
using System;
using System.Data.Entity;

namespace Example {
    public class User {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class MyDbContext : DbContext {
        public DbSet<User> Users { get; set; }
    }

    class Program {
        static void Main() {
            using (var context = new MyDbContext()) {
                var user = new User { Id = 1, Name = "John Doe", Email = "john.doe@example.com" };
                context.Users.Add(user);
                context.SaveChanges();
            }
        }
    }
}
```

### Summary
The Object-Relational Mapping (ORM) pattern achieves seamless integration between the database and object-oriented programming by mapping database tables to objects. Although ORM offers benefits such as higher development productivity and simpler code, you need to weigh performance overhead and complex queries when using it.

## Sources

- [Wikipedia · Object–relational mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)
- [Fowler · ORM Hate](https://martinfowler.com/bliki/OrmHate.html) (positioning analysis, [S26])

<!-- BACKLINKS-AUTO -->
## Related pages

- [anemic-domain-model](/anti-patterns/anemic-domain-model.md)
- [glossary](/glossary.md)
- [knowledge](/knowledge.md)
- [overview](overview.md)
- [repository](repository.md)
- [transaction-script](transaction-script.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
