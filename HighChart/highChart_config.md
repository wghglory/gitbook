# HighChart config

```javascript
export const config = {
  title: '',
  legend: {
    enabled: false,
  },
  colors: [
    // '#7373FF', // push it to first when needing to display myProduct: purple(myproduct)
    '#ffd669', // yellow
    '#F5896C', // red
    '#72C284', // green
    '#f15c80',
    '#e4d354',
    '#8d4653',
    '#91e8e1',
  ],
  chart: {
    height: 260,
    width: 600,
    style: {
      fontFamily: '.PingFang SC',
      color: '#d8d9d8',
    },
  },

  yAxis: {
    allowDecimals: false,
    title: {
      text: '',
    },
    min: 0,
    max: 5,
    tickInterval: 1,
    // gridLineDashStyle: 'longdash',
    // minorGridLineColor: '#f5f5f5',
    // gridLineWidth: 2,
    gridLineColor: '#f5f5f5',
    labels: {
      style: {
        color: '#a6a6a6',
      },
    },
  },
  credits: {
    enabled: false,
  },
  animation: false,
  plotOptions: {
    series: {
      point: {
        events: {
          // drag: function(e) {
          //     // Returning false stops the drag and drops. Example:
          //     if (e.y > 100) {
          //         this.y = 100
          //         return false
          //     }
          // },
          // drop: function(e) {
          //     console.log(e)
          //     console.log(this)
          //     // 更新用户数据到state
          // }
        },
        pointWidth: 18,
        //stacking: 'percent',
        dataLabels: {
          enabled: true,
          inside: true,
          align: 'right',
          color: '#fff',
        },
      },
      // stickyTracking: false
    },
    spline: {
      marker: {
        radius: 6,
        lineColor: '#666666',
        lineWidth: 1,
      },
    },
    line: {
      cursor: 'ns-resize',
    },
  },

  tooltip: {
    yDecimals: 2,
  },
};
```
