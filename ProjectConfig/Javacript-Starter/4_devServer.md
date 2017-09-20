# _Development_ Web Servers

* **http-server**: Ultra -simple, Single command serves current directory
* **live-server**: Lightweight, Support live-reloading
* **Express**: Comprehensive, Highly Configurable, Production grade, Can run it everywhere
* **budo**: Integrates with Browserify, Includes hot reloading
* **Webpack dev server**: Built in to Webpack, Serves from memory, Includes hot reloading
* **Browsersync**: Dedicated IP for sharing work on LAN. ==_All interactions remain in sync!_== Great for cross-device testing. Integrates with Webpack, Browserify, Gulp

## Express setup

```javascript
/** express dev server */

let express = require('express')
let path = require('path')
let open = require('open')

let port = 3000
let app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'))
})

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`)
  }
})
```

## Sharing work-in-progress

* localtunnel
* ngrok
* Surge
* now

### localtunnel (great!)

Easiest setup Ultra-versatile. Easily share work on your local machine. 让内网服务器暴露到公网上的开源项目

Setup:

    1. `npm install localtunnel -g`
    2. Start your app, if port is 3000
    3. `lt --port 3000` or `lt --port 3000 --subdomain wghglory`

Result is like:

    your url is: https://pgerjpkszz.localtunnel.me or https://wghglory.localtunnel.me

> Note: multiple devices, use browserSync and localtunnel together

### ngrok

Easy setup Secure. Secure tunnel to your local machine

1. Sign up
1. Install ngrok
1. Install authtoken
1. Start your app
1. `./ngrok http 80`

### now

No firewall hole Hosting persists. Quickly deploy Node.js to the cloud

1. `npm install -g now`
1. Create start script
1. `now`

### Surge

No firewall hole Hosting persists. Quickly host static files to public URL

1. `npm install -g surge`
1. `surge`
