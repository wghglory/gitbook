# HighChart Draggable

```javascript
// <script src="https://code.highcharts.com/highcharts.js"></script>
// <script src="https://rawgithub.com/highcharts/draggable-points/master/draggable-points.js"></script>
// <div id="container" style="height: 400px"></div>

var chart = new Highcharts.Chart({
  chart: {
    renderTo: 'container',
    animation: false
  },

  title: {
    text: 'Highcharts draggable points demo'
  },

  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },

  yAxis: {
    allowDecimals: false,
    title: {
      text: ''
    },
    min: 0,
    max: 5,
    tickInterval: 1,
    gridLineColor: '#f5f5f5',
    labels: {
      style: {
        color: '#a6a6a6'
      }
    }
  },

  plotOptions: {
    series: {
      point: {
        events: {
          drag: function (e) {
            // Returning false stops the drag and drops. Example:
            /*
              if (e.newY > 300) {
                  this.y = 300;
                  return false;
              }
            */
            e.y = Math.round(e.y);
            $('#drag').html(
              'Dragging <b>' +
              this.series.name +
              '</b>, <b>' +
              this.category +
              '</b> to <b>' +
              Highcharts.numberFormat(e.y, 2) +
              '</b>'
            );
          },
          drop: function (e) {
            // this.update(Math.round(this.y));
            this.update(Math.round(e.y));
            $('#drop').html(
              'In <b>' +
              this.series.name +
              '</b>, <b>' +
              this.category +
              '</b> was set to <b>' +
              Highcharts.numberFormat(this.y, 2) +
              '</b>'
            );
          }
        }
      },
      stickyTracking: false
    },
    column: {
      stacking: 'normal'
    },
    line: {
      cursor: 'ns-resize'
    }
  },

  tooltip: {
    yDecimals: 2
  },

  series: [{
    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    draggableY: true,
    dragMinY: 0,
    dragMaxY: 5,
    minPointLength: 1
  }]
});
```