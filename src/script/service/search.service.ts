import AbstractService from './abstract.service';

export default class SearchService extends AbstractService {

  getOverviewChartData(): Array<any> {
    const dataset: Array<any> = [];

    const aggregatorFn = (accumulator, item) => accumulator + item;
    const extractorAttributeFn = (sources, attribute) => sources.map(item => item.overview[attribute]).reduce(aggregatorFn, 0);
    const extractorFilterFn = (sources, attribute) => sources.map(item => item.overview.filters[attribute]).reduce(aggregatorFn, 0);
    const formatterFn = (category, value) => ({ category: category, value: value });
  
    let remaining = extractorAttributeFn(this._specification.sources, 'retrieved');
    dataset.push(formatterFn('Retrieved', remaining));

    remaining -= extractorFilterFn(this._specification.sources, 'duplicated');
    dataset.push(formatterFn('After duplication filter', remaining));
    
    remaining -= extractorFilterFn(this._specification.sources, 'inconsistent');
    dataset.push(formatterFn('After inconsistent filter', remaining));
    
    remaining -= extractorFilterFn(this._specification.sources, 'notfound');
    dataset.push(formatterFn('After not found filter', remaining));
    
    remaining -= extractorFilterFn(this._specification.sources, 'title');
    dataset.push(formatterFn('After title filter', remaining));
    
    remaining -= extractorFilterFn(this._specification.sources, 'abstract');
    dataset.push(formatterFn('After abstract filter', remaining));
    
    remaining -= extractorFilterFn(this._specification.sources, 'reading');
    dataset.push(formatterFn('After reading filter', remaining));

    const selected = extractorAttributeFn(this._specification.sources, 'selected');
    dataset.push(formatterFn('Selected', selected));

    return dataset;
  }

  getStrategyChartData(): Array<any> {
    const sources = this._specification.sources.map(this._getSourceFormatterFn());

    const filterFn = item => item.category.toLowerCase().startsWith('snowballing');
    const searchengineFilterFn = item => !filterFn(item);
    const snowballingFilterFn = item => filterFn(item);
    const searchengineSources = sources.filter(searchengineFilterFn)
    const snowballingSources = sources.filter(snowballingFilterFn);
    
    const aggregatorFn = (accumulator, item) => {
      for (const attribute in item) {
        if (typeof item[attribute] === 'number') {
          accumulator[attribute] = accumulator[attribute] ? accumulator[attribute] + item[attribute] : item[attribute];
        }
      }
      return accumulator;
    };
    const searchengineStrategy = searchengineSources.reduce(aggregatorFn, { category: 'Search engines' });
    const snowballingStrategy = snowballingSources.reduce(aggregatorFn, { category: 'Snowballing' });

    return [searchengineStrategy, snowballingStrategy];
  }

  getSourceChartData(): Array<any> {
    return this._specification.sources.map(this._getSourceFormatterFn());
  }

  private _getSourceFormatterFn() {
    return item => ({
      category: item.name,
      retrieved: item.overview.retrieved,
      duplicated: item.overview.filters.duplicated,
      inconsistent: item.overview.filters.inconsistent,
      notfound: item.overview.filters.notfound,
      title: item.overview.filters.title,
      abstract: item.overview.filters.abstract,
      reading: item.overview.filters.reading,
      selected: item.overview.selected
    });
  }
  
}
