import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uid from 'uid';
import { config } from '../chartConfig';
import Chart from '../../common/chart/Chart.jsx';
import highChartsDragabled from 'highcharts-draggable-points';
import { MY_PRODUCT_ID, MY_PRODUCT_COLOR } from '../const';
import update from 'immutability-helper';

class ChanpinjiazhilianJiazhiquxian extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { products } = this.props;

    const colors = config.colors;
    // const products = [
    //     {
    //         id: MY_PRODUCT_ID,
    //         name: MY_PRODUCT_NAME,
    //         analysis: [
    //             { id: 1, key: 'time', value: 5, category: 'delete' },
    //             { id: 2, key: 'space', value: 4, category: 'creativity' },
    //             { id: 3, key: 'cost', value: 2, category: 'add' }
    //         ]
    //     },
    //     {
    //         id: '34dsaffda',
    //         name: 'iphone 5',
    //         analysis: [
    //             { id: 1, key: 'time', value: 5, category: 'delete' },
    //             { id: 2, key: 'space', value: 4, category: 'creativity' },
    //             { id: 3, key: 'cost', value: 2, category: 'add' }
    //         ]
    //     },
    //     {
    //         id: 'dfasfdfsa',
    //         name: 'huawei mate',
    //         analysis: [
    //             { id: 1, key: 'time', value: 5, category: 'delete' },
    //             { id: 2, key: 'space', value: 4, category: 'creativity' },
    //             { id: 3, key: 'cost', value: 2, category: 'add' }
    //         ]
    //     }
    // ]

    const keys = products[0].analysis.map((p) => p.key);

    const chartData = {
      xAxis: {
        categories: keys,
        lineColor: '#f5f5f5',
        // lineWidth: 3,
        tickWidth: 0,
        // gridLineColor: '#197F07',
        // gridLineWidth: 3,
        // minorGridLineColor: '#f5f5f5',
        labels: {
          style: {
            color: '#a6a6a6'
          }
        },
        plotBands: [
          // {
          //     color: 'orange', // Color value
          //     from: 0.97, // Start of the plot band
          //     to: 1.03 // End of the plot band
          // }
        ]
      },
      series: []
    };

    products.forEach((product, i) => {
      const values = product.analysis.map((a, index) => {
        chartData.xAxis.plotBands.push({
          color: '#fcfcfc', // Color value
          from: index - 0.03, // Start of the plot band
          to: index + 0.03 // End of the plot band
        });
        return {
          analysisId: a.analysisId,
          yaosu: a.key,
          y: a.value,
          productId: product.id,
          productName: product.name
        };
      });

      let seriesSettings = {
        name: product.name,
        data: values,
        type: 'line',
        // draggableX: true,
        draggableY: true,
        dragMaxY: 5,
        dragMinY: 0,
        minPointLength: 1,
        lineWidth: 1,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 6
        }
      };

      if (product.id === MY_PRODUCT_ID) {
        seriesSettings.dashStyle = 'Solid';
      } else {
        seriesSettings.dashStyle = 'longdash';
      }

      chartData.series.push(seriesSettings);
    });

    config.colors[myProductIndex] = MY_PRODUCT_COLOR;

    const chartConfig = {
      ...config,
      ...chartData
    };

    let chartChangeset = [];

    config.chart.width = 800;
    config.plotOptions.series.point.events = {
      drag: function(e) {
        const { productId } = this;
        if (productId !== MY_PRODUCT_ID) return false; // 禁用非 我的产品拖动

        // Returning false stops the drag and drops
        if (e.y > 5) {
          this.y = 5;
          return false;
        }
      },
      drop: function() {
        this.y = Math.round(this.y);
        // this.update(this.y)
        const { productId, analysisId, y } = this;
        chartChangeset.push({ productId, analysisId, y });
      }
    };

    const buildUpdateOperation = (source, operationArr) => {
      let result = {};
      // source: copy products
      // operationArr: [ { id: '111', analysisId: 1, value: 99 }, { id: '111', analysisId: 3, value: 99 }, { id: '222', analysisId: 3, value: 99 } ]
      operationArr.forEach((c) => {
        const targetIndex = source.findIndex((x) => x.id === c.productId);
        const target = source.find((x) => x.id === c.productId);
        const targetAnalysisIndex = target.analysis.findIndex((x) => x.analysisId === c.analysisId);
        const targetAnalysis = target.analysis.find((x) => x.analysisId === c.analysisId);

        if (result[targetIndex]) {
          result[targetIndex].analysis[targetAnalysisIndex] = { $merge: { value: c.y } };
        } else {
          result[targetIndex] = {
            analysis: {
              [targetAnalysisIndex]: { $merge: { value: c.y } }
            }
          };
        }
      });

      /**
           * {
           *   1: {
           *      analysis: {
           *          0: { $merge: { value: 99 }},
           *          2: { $merge: { value: 99 }}
           *      }
           *   },
           *   2: {
           *      analysis: {
           *          2: { $merge: { value: 99 }}
           *      }
           *   }
           * }
           */
      return result;
    };

    const saveData = (step) => {
      const operation = buildUpdateOperation(products, chartChangeset);

      var result = update(products, operation);

      saveAnliFun(result, () => {
        setCurrentStep.call(this, step + 1);
      });
    };

    return (
      <div className="container-jingpin">
        <header>
          {products.map((p, index) => (
            <span key={p.id}>
              <i style={{ background: colors[index] }} className="circle" />
              {p.name}
            </span>
          ))}
        </header>
        <div className="jingpin-chart">
          <Chart className="chart" config={chartConfig} container="jingpin" modules={[ highChartsDragabled ]} />
        </div>
      </div>
    );
  }
}

export default ChanpinjiazhilianJiazhiquxian;
