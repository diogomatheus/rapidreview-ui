import * as amcharts5 from '@amcharts/amcharts5';
import * as amcharts5ThemeAnimated from '@amcharts/amcharts5/themes/Animated';
import * as amcharts5PluginExporting from '@amcharts/amcharts5/plugins/exporting';
import AbstractVisualizationBuilder from '../abstract-visualization.builder';

export default abstract class AbstractChartBuilder extends AbstractVisualizationBuilder {

  protected _root: amcharts5.Root;
  protected _exporting: amcharts5PluginExporting.Exporting;

  constructor(containerId: string) {
    super(containerId);

    this._root = amcharts5.Root.new(this._containerId);
    this._root.setThemes([amcharts5ThemeAnimated.default.new(this._root)]);

    this._exporting = amcharts5PluginExporting.Exporting.new(
      this._root,
      {
        menu: amcharts5PluginExporting.ExportingMenu.new(this._root, { align: 'right', valign: 'bottom' }),
        filePrefix: this._containerId
      }
    );
  }
  
}
