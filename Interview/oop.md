### Give me an example you used OOP

OOP: abstraction, Encapsulation, inheritance, polymorphism.

In a project, I used repository pattern. So there is an abstract BaseRepository, which includes Add, Remove, Update methods, etc. Any repository inherits from this baseRepo will have these common methods. And  we can also add some new properties or methods for a specific class.

### SOLID principles

* *Single responsibility*
* *Open close*: open for extension, but closed for modification
* *Liskov substitution*: Can use baseType accepts childType without altering the correctness of that program. (`Shape s = new Rectangle();`)
* *Interface segregation*: many small interfaces rather than a big one, only implement interfaces needed
* *DI*: decouple. High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

