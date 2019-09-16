# .Net Core Fundamentals (.net core v1.1.2)

## Get Started

Follow Official website: <https://docs.microsoft.com/en-us/aspnet/core/getting-started>

## Adding a Configuration Source

Asp.net core no longer uses `web.config` as configuration file. Instead, `appsettings.json` is used for this purpose.

## Features of Asp.net core

1.  Modular version of .NET Framework
1.  supports different environments
1.  cross-platform
1.  better performance
1.  Dependency Injection (Loose coupling, less code changes, better testability)

## Startup.cs -- Entry point

1.  `ConfigureServices` is used to add services to the container, and to configure those services, **Dependency Injection!**

    - AddTransient: Every request creates an instance. 每次请求都创建一个新的实例. always different; a new instance is provided to every controller and every service.
    - AddScoped: the same within a request, but different across different requests. 相同请求得到同一个实例，常用注册 Repository。不同请求实例不同
    - AddSingleton: the same for every object and every request

1.  `Configure` is used to specify how an ASP.NET application will respond to individual HTTP requests. Use **middleware** to configure the HTTP request pipeline

## Request Pipeline & Middleware

Request --> Middleware --> Middleware --> ... --> Response

![Application Startup](http://om1o84p1p.bkt.clouddn.com//1500541281.png)

## ViewComponents VS PartialView

ViewComponent is a upgrade of PartialView.

**Partial View:**

Usually contains only html code and the model which has to be the one passed in calling page. Render PartialView in Parent View: `@Html.Partial("partialview", model)`

**ViewComponent:**

Contains logic! It has a `Invoke` method which will be called and render its ViewComponent

```csharp
using System.Collections.Generic;
using Aspnetcore.Pieshop.Webapp.Models;
using Aspnetcore.Pieshop.Webapp.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Aspnetcore.Pieshop.Webapp.ViewComponents
{
    public class ShoppingCartSummaryViewComponent : ViewComponent
    {
        private readonly ShoppingCart _shoppingCart;

        public ShoppingCartSummaryViewComponent(ShoppingCart shoppingCart)
        {
            _shoppingCart = shoppingCart;
        }

        public IViewComponentResult Invoke()
        {
            var items = _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            var shoppingCartViewModel = new ShoppingCartViewModel
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = _shoppingCart.GetShoppingCartTotal()
            };
            return View(shoppingCartViewModel);
        }
    }
}
```

Parent View which called the ViewComponent:

```csharp
// Maybe in _Layout.cshtml
@await Component.InvokeAsync("ShoppingCartSummary")
```

## MVC cons and pros

pros:

1.  Separation of Concerns
1.  testability
1.  reuse

cons:

View may change too fast and Model cannot keep pace with View. Usually have to create ViewModels for View. This is painful as application get larger and larger.

## Web Api in .Net Core

**Post**:

Use `POST` for creating a resource

- 201 Created
- Header: content-type

Validation

- Data annotations
- ModelState

**Put/Patch**:

Use `PUT` for full updates, `PATCH` for partial updates

- JsonPatch standard
- 204 NoContent or 200 Ok

**Delete**:

`DELETE` is for deleting resources

- 204 NoContent
