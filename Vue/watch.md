# Vue watch shallow and deep

Shallow watch by default:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
      integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
      crossorigin="anonymous"
    />

    <style type="text/css">
      .footer {
        border-top-width: 2px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <br />
      <div id="growler">
        <p>An example of a watched property.</p>

        <table class="table">
          <thead>
            <tr>
              <th>Beer</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="beer in beers">
              <td>{{ beer.name }}</td>
              <td>{{ beer.price }}</td>
              <td>
                <button class="btn btn-warning" v-on:click="buy(beer)">buy</button>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td class="footer">Subtotal</td>
              <td class="footer">{{ subTotal }}</td>
              <td class="footer"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <script src="https://unpkg.com/vue@2.2.5/dist/vue.js" type="text/javascript"></script>

    <script type="text/javascript">
      var growler = new Vue({
        el: '#growler',
        data: {
          beers: [
            {
              name: 'Ahool Ale',
              price: 2.8,
            },
            {
              name: 'Agogwe Ale',
              price: 2.38,
            },
            {
              name: 'Aswang Ale',
              price: 3.05,
            },
            {
              name: "Buru's Barley Wine",
              price: 2.95,
            },
            {
              name: 'Hyote Chocolate Stout',
              price: 4.68,
            },
            {
              name: 'Igopogo Pilsner',
              price: 3.4,
            },
            {
              name: 'Jackalobe Lager',
              price: 2.49,
            },
            {
              name: 'Mahamba Barley Wine',
              price: 4.89,
            },
            {
              name: 'Megalodon Pale Ale',
              price: 3.76,
            },
            {
              name: 'Pope Lick Porter',
              price: 3.52,
            },
            {
              name: 'Chocolate Pukwudgie Stout',
              price: 4.17,
            },
            {
              name: 'Sharlie Pilsner',
              price: 2.92,
            },
            {
              name: 'Sigbin Stout',
              price: 2.49,
            },
            {
              name: 'Snallygaster Pale Ale',
              price: 3.64,
            },
            {
              name: 'Tikibalang Barley Wine',
              price: 4.21,
            },
            {
              name: 'Pale Popobawa Ale',
              price: 4.34,
            },
            {
              name: 'North Adjule Lager',
              price: 3.84,
            },
          ],

          shoppingCart: [],
          subTotal: 0.0,
        },
        watch: {
          shoppingCart: function() {
            this.updateSubTotal();
          },
        },
        created: function() {
          this.updateSubTotal();
        },
        methods: {
          updateSubTotal: function() {
            var length = this.shoppingCart.length;

            var t = 0;
            for (var i = 0; i < length; i++) {
              t += this.shoppingCart[i].price;
            }
            this.subTotal = t;
          },

          buy: function(beer) {
            this.shoppingCart.push(beer);
          },
        },
      });
    </script>
  </body>
</html>
```

Deep watch: Only for scenarios needed since it's bad for performance.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
      integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
      crossorigin="anonymous"
    />

    <style type="text/css">
      .footer {
        border-top-width: 2px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <br />
      <div id="growler">
        <p>An example of a watched property.</p>

        <table class="table">
          <thead>
            <tr>
              <th>Beer</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="beer in beers">
              <td>{{ beer.name }}</td>
              <td>{{ beer.price }}</td>
              <td><button class="btn btn-warning" v-on:click="buy(beer)">buy</button></td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td class="footer">Subtotal</td>
              <td class="footer">{{ shoppingCart.subTotal }}</td>
              <td class="footer"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <br /><br />

    <script src="https://unpkg.com/vue@2.2.5/dist/vue.js" type="text/javascript"></script>

    <script type="text/javascript">
      var growler = new Vue({
        el: '#growler',
        data: {
          beers: [
            { name: 'Ahool Ale', price: 2.8 },
            { name: 'Agogwe Ale', price: 2.38 },
            { name: 'Aswang Ale', price: 3.05 },
            { name: "Buru's Barley Wine", price: 2.95 },
            { name: 'Hyote Chocolate Stout', price: 4.68 },
            { name: 'Igopogo Pilsner', price: 3.4 },
            { name: 'Jackalobe Lager', price: 2.49 },
            { name: 'Mahamba Barley Wine', price: 4.89 },
            { name: 'Megalodon Pale Ale', price: 3.76 },
            { name: 'Pope Lick Porter', price: 3.52 },
            { name: 'Chocolate Pukwudgie Stout', price: 4.17 },
            { name: 'Sharlie Pilsner', price: 2.92 },
            { name: 'Sigbin Stout', price: 2.49 },
            { name: 'Snallygaster Pale Ale', price: 3.64 },
            { name: 'Tikibalang Barley Wine', price: 4.21 },
            { name: 'Pale Popobawa Ale', price: 4.34 },
            { name: 'North Adjule Lager', price: 3.84 },
          ],

          shoppingCart: {
            items: [],
            subTotal: 0.0,
          },
        },
        watch: {
          shoppingCart: {
            handler: function(latest, original) {
              this.updateSubTotal();
            },
            deep: true,
          },
        },
        created: function() {
          this.updateSubTotal();
        },
        methods: {
          updateSubTotal: function() {
            var length = this.shoppingCart.items.length;

            var t = 0;
            for (var i = 0; i < length; i++) {
              t += this.shoppingCart.items[i].price;
            }
            this.shoppingCart.subTotal = t;
          },

          buy: function(beer) {
            this.shoppingCart.items.push(beer);
          },
        },
      });
    </script>
  </body>
</html>
```
