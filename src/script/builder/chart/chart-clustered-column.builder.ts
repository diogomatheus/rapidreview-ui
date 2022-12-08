import * as amcharts5 from '@amcharts/amcharts5';
import * as amcharts5XY from '@amcharts/amcharts5/xy';
import AbstractChartBuilder from './abstract-chart.builder';

export default class ChartClusteredColumnBuilder extends AbstractChartBuilder {

  private _chart: amcharts5XY.XYChart;
  private _xAxis: amcharts5XY.CategoryAxis<amcharts5XY.AxisRendererX>;
  private _yAxis: amcharts5XY.ValueAxis<amcharts5XY.AxisRendererY>;
  private _legend: amcharts5.Legend;
  private _columnSeries: Array<any>;

  reset(): any {
    super.reset();
    this._columnSeries = [];
    return this;
  }

  setColumnSeries(columnSeries: Array<any>): any {
    this._columnSeries = columnSeries;
    return this;
  }

  build(): any {
    this._chart = this._root.container.children.push(
      amcharts5XY.XYChart.new(
        this._root,
        {
          panX: false,
          panY: false,
          layout: this._root.verticalLayout
        }
      )
    );
    this._chart.get('colors')?.set('step', 2);

    this._createXAxis();
    this._createYAxis();
    this._createLegend();
    this._bulkCreateColumnSeries();
  }

  private _createXAxis() {
    this._xAxis = this._chart.xAxes.push(
      amcharts5XY.CategoryAxis.new(
        this._root,
        {
          categoryField: 'category',
          renderer: amcharts5XY.AxisRendererX.new(
            this._root,
            {
              minGridDistance: 10,
              cellStartLocation: 0.025,
              cellEndLocation: 0.975
            }
          )
        }
      )
    );

    const axisRendererX  = this._xAxis.get('renderer');
    if (axisRendererX) {
      axisRendererX.labels.template.setAll({
        fontSize: '1.1rem',
        fontWeight: 'bold'
      });
    }

    this._xAxis.data.setAll(this._data);
  }

  private _createYAxis() {
    this._yAxis = this._chart.yAxes.push(
      amcharts5XY.ValueAxis.new(
        this._root,
        {
          min: 0,
          extraMax: 0.2,
          maxPrecision: 0,
          renderer: amcharts5XY.AxisRendererY.new(
            this._root,
            {
              minGridDistance: 50
            }
          )
        }
      )
    );

    const axisRendererY = this._yAxis.get('renderer');
    if (axisRendererY) {
      axisRendererY.labels.template.setAll({
        fontSize: '0.8rem',
        fontWeight: 'bold'
      });
    }

    const yAxisTitle = amcharts5.Label.new(
      this._root,
      {
        text: 'N. OF DOCUMENTS',
        fontSize: '1.1rem',
        fontWeight: 'bold'
      }
    );
    yAxisTitle.setAll(
      {
        rotation: -90,
        centerX: amcharts5.percent(50),
        y: amcharts5.percent(50)
      }
    );
    this._yAxis.children.unshift(yAxisTitle);
  }

  private _createLegend() {
    this._legend = this._chart.children.push(
      amcharts5.Legend.new(
        this._root,
        {
          centerX: amcharts5.percent(50),
          x: amcharts5.percent(50)
        }
      )
    );
  }

  private _bulkCreateColumnSeries() {
    for (const item of this._columnSeries) {
      this._createColumnSeries(item.name, item.attr);
    }
  }

  private _createColumnSeries(name: string, attr: string): void {
    const series = this._chart.series.push(
      amcharts5XY.ColumnSeries.new(
        this._root,
        {
          name: name,
          xAxis: this._xAxis,
          yAxis: this._yAxis,
          categoryXField: 'category',
          valueYField: attr
        }
      )
    );

    series.columns.template.setAll({
      width: amcharts5.percent(90),
      maxWidth: 100,
      tooltipText: '{categoryX}, {name}: [bold]{valueY}[/]',
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeWidth: 2,
      strokeOpacity: 1,
      opacity: .9
    });

    const bulletFn = () => {
      return amcharts5.Bullet.new(
        this._root,
        {
          locationY: 1,
          sprite: amcharts5.Label.new(
            this._root,
            {
              populateText: true,
              text: "{valueY.formatNumber('#.')}",
              centerX: amcharts5.percent(50),
              dy: -30,
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }
          )
      });
    };
    series.bullets.push(bulletFn);

    series.data.setAll(this._data);
    series.appear(1000, 100);
    
    this._legend.data.push(series);
  }

}
