import * as amcharts5 from '@amcharts/amcharts5';
import * as amcharts5Map from '@amcharts/amcharts5/map';
import amcharts5GeodataContinentsHigh from '@amcharts/amcharts5-geodata/continentsHigh';
import AbstractChartBuilder from './abstract-chart.builder';

export default class ChartMapPinBuilder extends AbstractChartBuilder {

  private _chart: amcharts5Map.MapChart;

  build(): any {
    this._chart = this._root.container.children.push(
      amcharts5Map.MapChart.new(
        this._root,
        {
          wheelY: 'none',
          projection: amcharts5Map.geoMercator()
        }
      )
    );

    this._createPolygonSeries();
  }

  private _createPolygonSeries() {
    const polygonSeries = this._chart.series.push(
      amcharts5Map.MapPolygonSeries.new(
        this._root,
        {
          geoJSON: amcharts5GeodataContinentsHigh,
          exclude: ['antarctica'],
          fill: amcharts5.color(0xdfe6e9)
        }
      )
    );

    polygonSeries.mapPolygons.template.setAll({
      shadowColor: amcharts5.color(0xcccccc),
      shadowBlur: 2,
      shadowOffsetX: 2,
      shadowOffsetY: 2
    });

    const pointSeries = this._chart.series.push(amcharts5Map.MapPointSeries.new(this._root, {}));
    const bulletFn = (root: amcharts5.Root, series: amcharts5.Series, dataItem: any) => {      
      const bulletContainer = amcharts5.Container.new(root, {});
      const radius = 40;

      const circle = bulletContainer.children.push(
        amcharts5.Circle.new(
          root,
          {
            radius: radius,
            fill: amcharts5.color(0x0D47A1),
            dy: -radius * 2
          }
        )
      );

      const line = bulletContainer.children.push(
        amcharts5.Line.new(
          root,
          {
            stroke: amcharts5.color(0x0D47A1),
            height: -40,
            strokeGradient: amcharts5.LinearGradient.new(
              root,
              {
                stops:[{ opacity: 1 }, { opacity: 1 }, { opacity: 0 }]
              }
            )
          }
        )
      );

      const valueLable = bulletContainer.children.push(
        amcharts5.Label.new(
          root,
          {
            text: `${dataItem.dataContext.value}`,
            fill: amcharts5.color(0xffffff),
            fontSize: '1.1rem',
            fontWeight: '400',
            centerX: amcharts5.percent(50),
            centerY: amcharts5.percent(50),
            dy: -radius * 2
          }
        )
      );

      const titleLable = bulletContainer.children.push(
        amcharts5.Label.new(
          root,
          {
            text: dataItem.dataContext.title,
            fill: amcharts5.color(0x0D47A1),
            fontSize: '1.1rem',
            fontWeight: '500',
            centerY: amcharts5.percent(50),
            dy: -radius * 2,
            dx: radius
          }
        )
      );

      return amcharts5.Bullet.new(this._root, { sprite: bulletContainer });
    };
    pointSeries.bullets.push(bulletFn);

    for (const item of this._data) {
      pointSeries.data.push({
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude]
        },
        title: item.title,
        value: item.value
      });
    }
  }

}
