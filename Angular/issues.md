# Some issues

## Production error

### 1. e is not a constructor

`ng build` shows some warnings -- **export something failed**. When `ng-zorro-antd 7.2` gets introduced into the project, [@angular/cdk 6](https://material.angular.io/cdk/categories), a google material component dev kit, was used then as a dependency of `ng-zorro-antd`. But that cdk 6 doesn't export `ScrollingModule`. Although in dev environment the angular app is working well, `e is not a constructor` error raises in prod mode.

One way to solve this issue is to upgrade @angular/cdk to "^7.3.6".

### 2. ERROR Error: StaticInjectorError(AppModule)[t -> Overlay]:

```
ERROR Error: StaticInjectorError(AppModule)[CdkConnectedOverlay -> Overlay]:
  StaticInjectorError(Platform: core)[CdkConnectedOverlay -> Overlay]:
    NullInjectorError: No provider for Overlay!
```

When calling `ng-zorro-antd` select component, you might see this error due to the missing of `CdkOverlayModule`.

As we know, javascript is minimized, it's hard to understand the error. To display the whole error, do below:

```bash
ng serve --prod --optimization=false
```

You may see this error:

```
ng build --prod produces FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

So you need to increase memory limit:

```bash
export NODE_OPTIONS=--max_old_space_size=4096
```
