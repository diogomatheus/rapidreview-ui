import * as amcharts5 from '@amcharts/amcharts5';
import * as amcharts5Map from '@amcharts/amcharts5/map';
import amcharts5GeodataWorldHigh from '@amcharts/amcharts5-geodata/worldHigh';
import AbstractChartBuilder from './abstract-chart.builder';

export default class ChartMapHeatBuilder extends AbstractChartBuilder {

  private _chart: amcharts5Map.MapChart;
  private _legend: amcharts5.HeatLegend;
  
  build(): any {
    this._chart = this._root.container.children.push(
      amcharts5Map.MapChart.new(
        this._root,
        {
          wheelX: 'none',
          wheelY: 'none',
          projection: amcharts5Map.geoMercator()
        }
      )
    );

    this._createLegend();
    this._createPolygonSeries();
  }

  private _createLegend() {
    this._legend = this._chart.children.push(
      amcharts5.HeatLegend.new(
        this._root,
        {
          orientation: 'vertical',
          height: amcharts5.percent(90),
          startColor: amcharts5.color(0xfad390),
          endColor: amcharts5.color(0xeb2f06)
        }
      )
    );

    this._legend.startLabel.setAll({
      fontSize: '1.1rem',
      fontWeight: 'bold',
      fill: this._legend.get('startColor')
    });

    this._legend.endLabel.setAll({
      fontSize: '1.1rem',
      fontWeight: 'bold',
      fill: this._legend.get('endColor')
    });
  }

  private _createPolygonSeries() {
    const polygonSeries = this._chart.series.push(
      amcharts5Map.MapPolygonSeries.new(
        this._root,
        {
          geoJSON: amcharts5GeodataWorldHigh,
          valueField: 'value',
          calculateAggregates: true,
          exclude: ['AQ'],
          fill: amcharts5.color(0xdfe6e9)
        }
      )
    );

    polygonSeries.set(
      'heatRules',
      [
        {
          target: polygonSeries.mapPolygons.template,
          dataField: 'value',
          min: amcharts5.color(0xfad390),
          max: amcharts5.color(0xeb2f06),
          minValue: 1,
          key: 'fill'
        }
      ]
    );

    const onDataValidated = () => {
      this._legend.set('startValue', 1);
      this._legend.set('endValue', polygonSeries.getPrivate('valueHigh'));
    };
    polygonSeries.events.on('datavalidated', onDataValidated);

    const tooltipTextAdapter = (tooltipText, target) => target.dataItem.get('value') ? '{name}: {value}' : '{name}: 0';
    polygonSeries.mapPolygons.template.adapters.add('tooltipText', tooltipTextAdapter);

    polygonSeries.data.setAll(this._data);
  }

}
