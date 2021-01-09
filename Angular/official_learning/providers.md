# Fundamental / NgModules / Providers + Singleton services

```shell
ng generate service user
ng g s user
```

By default, this decorator has a `providedIn` property, which creates a provider for the service

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  // 'root' specifies that Angular should provide the service in the root injector.
  // ** providedIn: 'root' creates Singleton service **
})
export class UserService {}
```

## Provider Scope

**You should always provide your service in the `root injector` unless there is a case where you want the service to be available only if the consumer imports a particular `@NgModule`.**

### I. providedIn and NgModules

It's also possible to specify that a service should be provided in a particular `@NgModule`. For example, if you don't want `UserService` to be available to applications unless they import a `UserModule` you've created, you can specify that the service should be provided in the module:

1.  Preferred way: enables tree-shaking of the service if nothing injects it.

    ```typescript
    // user.service.ts
    import { Injectable } from '@angular/core';
    import { UserModule } from './user.module';

    @Injectable({
      providedIn: UserModule,
    })
    export class UserService {}
    ```

1.  Another way: No tree-shaking

    ```typescript
    import { NgModule } from '@angular/core';

    import { UserService } from './user.service';

    @NgModule({
      providers: [UserService],
    })
    export class UserModule {}
    ```

### II. Limiting provider scope by lazy loading modules

When the Angular router lazy-loads a module, it creates a new injector. This injector is a child of the root application injector. Imagine a tree of injectors; there is a single root injector and then a child injector for each lazy loaded module. The router adds all of the providers from the root injector to the child injector.

当 Angular 的路由器惰性加载一个模块时，它会创建一个新的注入器。这个注入器是应用的根注入器的一个子注入器。想象一棵注入器树，它有唯一的根注入器，而每一个惰性加载模块都有一个自己的子注入器。**路由器会把根注入器中的所有提供商添加到子注入器中。如果路由器在惰性加载时创建组件， Angular 会更倾向于使用从这些提供商中创建的服务实例**，而不是来自应用的根注入器的服务实例。

任何在惰性加载模块的上下文中创建的组件（比如路由导航），都会获取该服务的局部实例，而不是应用的根注入器中的实例。而外部模块中的组件，仍然会收到来自于应用的根注入器创建的实例。

虽然你可以使用惰性加载模块来提供实例，但不是所有的服务都能惰性加载。比如，像路由之类的模块只能在根模块中使用。路由器需要使用浏览器中的全局对象 location 进行工作。

### III. Limiting provider scope with components

when you want to eagerly load a module that needs a service all to itself. Providing a service in the component limits the service only to that component (other components in the same module can’t access it.)

```typescript
@Component({
  /* . . . */
  providers: [UserService]
})
```

## Providing services in modules vs. components

1.  Providing services in modules: **Generally, provide services the whole app needs in the root module (Singleton) and scope services by providing them in lazy loaded modules.**

1.  Providing services in components: (Non-Singleton) Register a provider with a component when you must limit a service instance to a component and its child components. For example, a user editing component, UserEditorComponent, that needs a private copy of a caching UserService should register the UserService with the UserEditorComponent. Then each new instance of the UserEditorComponent gets its own cached service instance.
