import GeneralService from './../service/general.service';
import SearchService from './../service/search.service';
import PublicationService from './../service/publication.service';
import ParticipationService from './../service/participation.service';
import DatasetService from './../service/dataset.service';
import TableBuilder from './../builder/table/table.builder';
import ChartFunnelBuilder from './../builder/chart/chart-funnel.builder';
import ChartClusteredColumnBuilder from './../builder/chart/chart-clustered-column.builder';
import ChartColumnBuilder from './../builder/chart/chart-column.builder';
import ChartPieBuilder from './../builder/chart/chart-pie.builder';
import ChartMapPinBuilder from './../builder/chart/chart-map-pin.builder';
import ChartMapHeatBuilder from './../builder/chart/chart-map-heat.builder';

export default class RapidReviewUIDirector {

  private _url: string;
  private _specification: object;
  private _generalService: GeneralService;
  private _searchService: SearchService;
  private _publicationService: PublicationService;
  private _participationService: ParticipationService;
  private _datasetService: DatasetService;

  constructor(url: string, specification: object) {
    this._url = url;
    this._specification = specification;
    this._generalService = new GeneralService(this._specification);
    this._searchService = new SearchService(this._specification);
    this._publicationService = new PublicationService(this._specification);
    this._participationService = new ParticipationService(this._specification);
    this._datasetService = new DatasetService(this._specification);
  }

  init(): void {
    this._updateInformation();
    this._buildTables();
    this._buildCharts();
  }

  private _updateInformation(): void {
    const urlElement = document.getElementById('general-url');
    if (urlElement) {
      urlElement.innerHTML = new URL(this._url, document.baseURI).href;
    }

    const titleElement = document.getElementById('general-title');
    if (titleElement) {
      titleElement.innerHTML = this._generalService.getTitleGeneralData();
    }

    const abstractElement = document.getElementById('general-abstract');
    if (abstractElement) {
      abstractElement.innerHTML = this._generalService.getAbstractGeneralData();
    }

    const keywordsElement = document.getElementById('general-keywords');
    if (keywordsElement) {
      keywordsElement.innerHTML = this._generalService.getKeywordsGeneralDataFormatted();
    }
  }

  private _buildTables(): void {
    new TableBuilder('publication-venue-type-table')
      .setData(this._publicationService.getVenueTypeTableData())
      .setColumns([
        { title: 'Type', data: 'type' },
        { title: 'Publications', data: 'value' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 1, 'desc' ]])
      .build();
      
    new TableBuilder('publication-venue-table')
      .setData(this._publicationService.getVenueTableData())
      .setColumns([
        { title: 'Venue', data: 'venue' },
        { title: 'Publications', data: 'value' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 1, 'desc' ]])
      .build();
      
    new TableBuilder('publication-continent-table')
      .setData(this._publicationService.getContinentTableData())
      .setColumns([
        { title: 'Continent', data: 'continent' },
        { title: 'Publications', data: 'value' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 1, 'desc' ]])
      .build();
      
    new TableBuilder('publication-country-table')
      .setData(this._publicationService.getCountryTableData())
      .setColumns([
        { title: 'Country', data: 'country' },
        { title: 'Publications', data: 'value' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 1, 'desc' ]])
      .build();
      
    new TableBuilder('participation-institution-table')
      .setData(this._participationService.getInstitutionTableData())
      .setColumns([
        { title: 'Institution', data: 'institution' },
        { title: 'Participations', data: 'value' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 1, 'desc' ]])
      .build();
      
    new TableBuilder('participation-author-table')
      .setData(this._participationService.getAuthorTableData())
      .setColumns([
        { title: 'Author', data: 'author' },
        { title: 'Participations', data: 'value' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 1, 'desc' ]])
      .build();
      
    new TableBuilder('dataset-selected-documents-table')
      .setData(this._datasetService.getSelectedDocumentsTableData())
      .setColumns([
        { title: 'Title', data: 'title' },
        { title: 'Year', data: 'year' }
      ])
      .setColumnDefs([{ width: '200px', targets: 1 }])
      .setOrder([[ 0, 'asc' ]])
      .build();
  }

  private _buildCharts() : void {
    new ChartFunnelBuilder('search-overview-chart')
      .setData(this._searchService.getOverviewChartData())
      .build();

    new ChartClusteredColumnBuilder('search-strategy-chart')
      .setColumnSeries(this._getClusteredColumnSeries())
      .setData(this._searchService.getStrategyChartData())
      .build();

    new ChartClusteredColumnBuilder('search-source-chart')
      .setColumnSeries(this._getClusteredColumnSeries())
      .setData(this._searchService.getSourceChartData())
      .build();

    new ChartColumnBuilder('publication-year-chart')
      .setData(this._publicationService.getYearChartData())
      .build();

    new ChartPieBuilder('publication-strategy-chart')
      .setData(this._publicationService.getStrategyChartData())
      .build();

    new ChartPieBuilder('publication-venue-type-chart')
      .setData(this._publicationService.getVenueTypeChartData())
      .build();

    new ChartMapPinBuilder('publication-continent-chart')
      .setData(this._publicationService.getContinentChartData())
      .build();

    new ChartMapHeatBuilder('publication-country-chart')
      .setData(this._publicationService.getCountryChartData())
      .build();
  }

  private _getClusteredColumnSeries() {
    return [
      { name: 'Retrieved', attr: 'retrieved' },
      { name: 'Duplicated', attr: 'duplicated' },
      { name: 'Inconsistent', attr: 'inconsistent' },
      { name: 'Not found', attr: 'notfound' },
      { name: 'Title', attr: 'title' },
      { name: 'Abstract', attr: 'abstract' },
      { name: 'Reading', attr: 'reading' },
      { name: 'Selected', attr: 'selected' }
    ];
  }

}
