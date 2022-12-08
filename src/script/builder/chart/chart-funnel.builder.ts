import * as amcharts5Percent from '@amcharts/amcharts5/percent';
import AbstractChartBuilder from './abstract-chart.builder';

export default class ChartFunnelBuilder extends AbstractChartBuilder {

  private _chart: amcharts5Percent.SlicedChart;
  
  build(): any {
    this._chart = this._root.container.children.push(
      amcharts5Percent.SlicedChart.new(this._root, {})
    );

    this._createFunnelSeries();
  }

  private _createFunnelSeries(): void {
    const series = this._chart.series.push(
      amcharts5Percent.FunnelSeries.new(
        this._root,
        {
          orientation: 'vertical',
          categoryField: 'category',
          valueField: 'value',
          alignLabels: true
        }
      )
    );
    
    series.labels.template.setAll({
      paddingLeft: 30,
      fontSize: '1.1rem',
      fontWeight: 'bold',
      text: '{category}: {value}',
      textAlign: 'end'
    });

    const colorset = series.get('colors');
    if (colorset) {
      colorset.set('step', 2);
    }

    series.data.setAll(this._data);
    series.appear(1000, 100);
  }

}
