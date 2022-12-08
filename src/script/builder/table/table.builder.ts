import * as $ from 'jquery';
import JSZip from 'jszip/dist/jszip.min';
import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfMakeVFSFonts from '../../util/vfs-fonts';
import datatables from 'datatables.net-bs5/js/dataTables.bootstrap5.min';
import datatablesResponsive from 'datatables.net-responsive-bs5/js/responsive.bootstrap5.min';
import datatablesButtons from 'datatables.net-buttons-bs5/js/buttons.bootstrap5.min';
import datatablesButtonsHTML5 from 'datatables.net-buttons/js/buttons.html5';
import AbstractVisualizationBuilder from '../abstract-visualization.builder';

pdfMake.vfs = pdfMakeVFSFonts;
datatables(this, $);
datatablesResponsive(this, $);
datatablesButtons(this, $);
datatablesButtonsHTML5(this, $, JSZip, pdfMake);

export default class TableBuilder extends AbstractVisualizationBuilder {
  
  private _columns: Array<any>;
  private _columnDefs: Array<any>;
  private _order: Array<any>;
  private _responsive: boolean;
  private _paging: boolean;
  private _dom: string;
  private _buttons: Array<any>;

  reset(): TableBuilder {
    super.reset();
    this._columns = [];
    this._columnDefs = [];
    this._order = [];
    this._responsive = true;
    this._paging = true;
    this._dom = '<"container-fluid"<"row"<"col"B><"col"f>>>rt<"container-fluid"<"row"<"col"i><"col"p>>>';
    this._buttons = [ 'csv', 'excel', 'pdf'];
    return this;
  }
  
  setColumns(columns: Array<any>): TableBuilder {
    this._columns = columns;
    return this;
  }

  setColumnDefs(columnDefs: Array<any>): TableBuilder {
    this._columnDefs = columnDefs;
    return this;
  }

  setOrder(order: Array<any>): TableBuilder {
    this._order = order;
    return this;
  }

  setResponsive(responsive: boolean): TableBuilder {
    this._responsive = responsive;
    return this;
  }

  setPaging(paging: boolean): TableBuilder {
    this._paging = paging;
    return this;
  }

  setDom(dom: string): TableBuilder {
    this._dom = dom;
    return this;
  }

  setButtons(buttons: Array<any>): TableBuilder {
    this._buttons = buttons;
    return this;
  }
  
  build(): any {
    return $(`#${this._containerId}`).DataTable({
      data: this._data,
      columns: this._columns,
      columnDefs: this._columnDefs,
      order: this._order,
      responsive: this._responsive,
      paging: this._paging,
      dom: this._dom,
      buttons: this._buttons
    });
  }

}
