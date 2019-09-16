# Vue life cycle demo

```html
<html>
  <head>
    <title>Growler</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
      integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div class="container">
      <div id="growler">
        <p>Please check the console window</p>

        Update Button Clicks: <span>{{ counter }}</span>
        <br />
        <button class="btn btn-primary" v-on:click="onUpdateClick">Update</button>

        <br /><br />
      </div>

      <button id="destroyButton" class="btn btn-danger">Destroy</button>
    </div>

    <script src="https://unpkg.com/vue@2.2.5/dist/vue.js" type="text/javascript"></script>
    <script type="text/javascript">
      document.getElementById('destroyButton').addEventListener('click', function() {
        growler.$destroy();
      });

      var growler = new Vue({
        el: '#growler',
        data: {
          counter: 0,
        },

        methods: {
          onUpdateClick: function() {
            this.counter = this.counter + 1;
          },
        },

        beforeCreate: function() {
          console.log('beforeCreate');
        },

        created: function() {
          console.log('created');
        },

        beforeMount: function() {
          console.log('beforeMount');
        },

        mounted: function() {
          console.log('mounted');
        },

        beforeUpdate: function() {
          console.log('beforeUpdate');
        },

        updated: function() {
          console.log('updated');
        },

        beforeDestroy: function() {
          console.log('beforeDestroy');
        },

        destroyed: function() {
          console.log('afterDestroy');
        },
      });
    </script>
  </body>
</html>
```
