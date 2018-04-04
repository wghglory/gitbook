# React SetStateAsync

We know React setState is an asynchronous function which accept a second parameter as a callback. Although Facebook recommends to write any code after setState in `componentDidUpdate`, sometimes we might want to write the task directly in setState.

```javascript
this.setState(
  {
    load: !this.state.load,
    count: this.state.count + 1,
  },
  () => {
    console.log(this.state.count);
    console.log('加载完成');
  },
);
```

It's better to use Promise than callback:

```javascript
class AwesomeProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ipAddress: '',
    };
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async componentDidMount() {
    StatusBar.setNetworkActivityIndicatorVisible(true);
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json();
    await this.setStateAsync({ ipAddress: ip });
    StatusBar.setNetworkActivityIndicatorVisible(false);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>My IP is {this.state.ipAddress || 'Unknown'}</Text>
      </View>
    );
  }
}
```
