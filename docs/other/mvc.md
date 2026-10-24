# MVC

#### Overview
The Model-View-Controller (MVC) pattern is a software design pattern commonly used to build user interfaces. It divides an application into three parts — the Model, the View, and the Controller — to achieve separation of concerns, which makes the code more modular, maintainable, and extensible.

#### Components

1. **Model**
   - **Responsibility**: Handles the application's data logic. The model directly manages data, logic, and rules.
   - **Example**: In an e-commerce application, the model might include entity classes such as User, Product, and Order, along with the related business logic and data access code.

2. **View**
   - **Responsibility**: Responsible for presenting data. The view is the part of the user interface that displays data from the model.
   - **Example**: In an e-commerce application, the view might be the web page or app screen that shows the product list or the shopping cart contents.

3. **Controller**
   - **Responsibility**: Handles user input and updates the model and the view. The controller receives user input, calls the model to process it, and then passes the result to the view for display.
   - **Example**: In an e-commerce application, the controller might handle a user's request to add a product to the cart and update the view to show the latest cart contents.

#### Advantages

- **Separation of concerns**: Separating data, business logic, and the user interface makes the code easier to understand and maintain.
- **Testability**: Each part can be developed and tested independently, which simplifies unit and functional testing.
- **Reusability**: Views and models can be changed or reused independently, without modifying the other parts.

#### Disadvantages

- **Added complexity**: For small applications, MVC may introduce unnecessary complexity.
- **Development cost**: Developers need to understand and follow the principles of the MVC pattern, so the initial learning cost is relatively high.

#### Use cases

- **Web applications**: The MVC pattern is very popular in web applications, for example ASP.NET MVC, Ruby on Rails, and Spring MVC.
- **Desktop applications**: MVC is also common in desktop application development, for example the Java Swing framework.

#### Example code

##### Java example (Spring MVC)

1. **Model**

```java
public class Product {
    private int id;
    private String name;
    private double price;

    public Product(int id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}
```

2. **View** (product.jsp)

```html
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<body>
    <h2>Product List</h2>
    <ul>
        <c:forEach var="product" items="${productList}">
            <li>${product.name} - ${product.price}</li>
        </c:forEach>
    </ul>
</body>
</html>
```

3. **Controller**

```java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ProductController {
    @RequestMapping("/products")
    public String getProducts(Model model) {
        List<Product> productList = new ArrayList<>();
        productList.add(new Product(1, "Product A", 10.0));
        productList.add(new Product(2, "Product B", 20.0));
        
        model.addAttribute("productList", productList);
        return "product";
    }
}
```

##### Python example (Django)

1. **Model**

```python
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
```

2. **View** (templates/product_list.html)

```html
<!DOCTYPE html>
<html>
<body>
    <h2>Product List</h2>
    <ul>
    {% for product in product_list %}
        <li>{{ product.name }} - {{ product.price }}</li>
    {% endfor %}
    </ul>
</body>
</html>
```

3. **Controller**

> Note: Django itself uses the MTV (Model-Template-View) structure, in which the `view` view function takes on the role of the controller in traditional MVC (receiving the request, calling the model, choosing a template to render), while the Template corresponds to the view in MVC.

```python
from django.shortcuts import render
from .models import Product

def product_list(request):
    products = Product.objects.all()
    return render(request, 'product_list.html', {'product_list': products})
```

##### C# example (ASP.NET MVC)

1. **Model**

```csharp
public class Product {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
```

2. **View** (ProductList.cshtml)

```html
@model IEnumerable<Product>

<!DOCTYPE html>
<html>
<body>
    <h2>Product List</h2>
    <ul>
    @foreach (var product in Model) {
        <li>@product.Name - @product.Price</li>
    }
    </ul>
</body>
</html>
```

3. **Controller**

```csharp
using System.Collections.Generic;
using System.Web.Mvc;

public class ProductController : Controller {
    public ActionResult List() {
        var products = new List<Product> {
            new Product { Id = 1, Name = "Product A", Price = 10.0m },
            new Product { Id = 2, Name = "Product B", Price = 20.0m }
        };
        return View(products);
    }
}
```

### Summary
The Model-View-Controller (MVC) pattern separates application logic, data management, and the user interface, making the code clearer, more maintainable, and more extensible. Although it introduces some complexity, in most modern applications MVC significantly improves code quality and development productivity. The example code in different programming languages above shows how widely applicable and powerful the MVC pattern is.

## Sources

- [Wikipedia · Model–view–controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [Fowler · GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html) (tracing the evolution of MVC/MVP, [S26])

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [overview](overview.md)
- [transaction-script](transaction-script.md)
- [reference](/reference.md)
- [applications](/research/applications.md)
- [coverage](/research/coverage.md)
