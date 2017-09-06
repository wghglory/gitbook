# 常见bug

1. <p style="color:red;">[Error] Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component.</p>

    在ajax请求还没结束的时候下载了组件，比如切换路由，在ajax请求回调中 `setState` 导致。使用 redux 或者 mobx 可以解决。

    另一个办法：

    ```jsx
    componentDidMount() {
      this._isMount = true;
    }

    componentWillUnmount() {
      this._isMount = false;
    }

    updateLanguage(lang) {
      fetchAsync(lang).then(function (repos) {
        if (this._isMount) {
          this.setState(function () {
            return {repos: repos};
          });
        }
      }.bind(this));
    }
    ```
