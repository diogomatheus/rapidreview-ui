import AbstractService from './abstract.service';
import CountryRepository from '../repository/country.repository';

export default class PublicationService extends AbstractService {

  private _countryRepository: CountryRepository;

  constructor(specification: any) {
    super(specification);
    this._countryRepository = new CountryRepository();
  }

  getYearChartData(): Array<any> {
    const years = this._specification.documents.map(item => item.year);

    const oldest = Math.min.apply(Math, years);
    const latest = Math.max.apply(Math, years);
    const range = Array.from({ length: latest - oldest + 1 }, (v, k) => k + oldest);

    const counterFn = item => years.filter(v => v === item).length;
    const formatterFn = item => ({ category: item.toString(), value: counterFn(item) });
    return range.map(formatterFn);
  }

  getStrategyChartData(): Array<any> {
    const extractorFn = item => ({ category: item.name, selected: item.overview.selected });
    const sources = this._specification.sources.map(extractorFn);

    const filterFn = item => item.category.toLowerCase().startsWith('snowballing');
    const searchengineFilterFn = item => !filterFn(item);
    const snowballingFilterFn = item => filterFn(item);
    const searchengineSources = sources.filter(searchengineFilterFn);
    const snowballingSources = sources.filter(snowballingFilterFn);

    const aggregatorFn = (accumulator, item) => accumulator + item.selected;
    const searchengineCounter = searchengineSources.reduce(aggregatorFn, 0);
    const snowballingCounter = snowballingSources.reduce(aggregatorFn, 0);

    const formatterFn = (name, counter) => ({ category: name, value: counter });
    const searchEngineStrategy = formatterFn('Search engines', searchengineCounter);
    const snowballingStrategy = formatterFn('Snowballing', snowballingCounter);

    return [searchEngineStrategy, snowballingStrategy];
  }

  getVenueTypeChartData(): Array<any> {
    const types = this._specification.documents.map(item => item.publication.type);

    const unique = [...new Set(types)].sort();

    const counterFn = item => types.filter(other => other === item).length;
    const formatterFn = item => ({ category: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }

  getVenueTypeTableData(): Array<any> {
    const types = this._specification.documents.map(item => item.publication.type);

    const unique = [...new Set(types)].sort();

    const counterFn = item => types.filter(other => other === item).length;
    const formatterFn = item => ({ type: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }

  getVenueTableData(): Array<any> {
    const venues = this._specification.documents.map(item => item.publication.venue);

    const unique = [...new Set(venues)].sort();

    const counterFn = item => venues.filter(other => other === item).length;
    const formatterFn = item => ({ venue: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }

  getContinentChartData(): Array<any> {
    const extractorFn = item => item.authors.map(author => author.institution);
    const institutionClusters = this._specification.documents.map(extractorFn);

    const retrieverFn = item => this._countryRepository.findByName(item.country).continent_name;
    const extractorContinentFn = items => items.map(retrieverFn);
    const continentClusters = institutionClusters.map(extractorContinentFn);

    const comparatorFn = (item, other) => other === item;
    const filterFn = (item, index, self) => index === self.findIndex(other => comparatorFn(item, other));
    const filteredContinentClusters = continentClusters.map(items => items.filter(filterFn));

    const aggregatorFn = (accumulator, item) => accumulator.concat(item);
    const continents = filteredContinentClusters.reduce(aggregatorFn, []);

    const counterFn = item => continents.filter(other => comparatorFn(item, other)).length;
    return [
      { title: 'North\nAmerica', latitude: 45, longitude: -100, width: 100, height: 100, value: counterFn('North America') },
      { title: 'South\nAmerica', latitude: -25, longitude: -57, width: 100, height: 100, value: counterFn('South America') },
      { title: 'Europe', latitude: 55, longitude: 35, width: 100, height: 100, value: counterFn('Europe') },
      { title: 'Africa', latitude: 0, longitude: 25, width: 100, height: 100, value: counterFn('Africa') },
      { title: 'Asia', latitude: 45, longitude: 95, width: 100, height: 100, value: counterFn('Asia') },
      { title: 'Oceania', latitude: -25, longitude: 138, width: 100, height: 100, value: counterFn('Oceania') }
    ];
  }

  getContinentTableData(): Array<any> {
    const extractorFn = item => item.authors.map(item => item.institution);
    const institutionClusters = this._specification.documents.map(extractorFn);

    const retrieverFn = item => this._countryRepository.findByName(item.country).continent_name;
    const continentClusters = institutionClusters.map(items => items.map(retrieverFn));
    
    const comparatorFn = (item, other) => other === item;
    const filterFn = (item, index, self) => index === self.findIndex(other => comparatorFn(item, other));
    const filteredContinentClusters = continentClusters.map(items => items.filter(filterFn));

    const aggregatorFn = (accumulator, item) => accumulator.concat(item);
    const continents = filteredContinentClusters.reduce(aggregatorFn, []);
    
    const unique = [...new Set(continents)].sort();

    const counterFn = item => continents.filter(other => comparatorFn(item, other)).length;
    const formatterFn = item => ({ continent: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }

  getCountryChartData(): Array<any> {
    const extractorAuthorFn = item => item.authors.map(item => item.institution);
    const institutionClusters = this._specification.documents.map(extractorAuthorFn);

    const retrieverFn = item => this._countryRepository.findByName(item.country).country_code;
    const countryClusters = institutionClusters.map(items => items.map(retrieverFn));

    const comparatorFn = (item, other) => other === item;
    const filterFn = (item, index, self) => index === self.findIndex(other => comparatorFn(item, other));
    const filteredCountryClusters = countryClusters.map(items => items.filter(filterFn));

    const aggregatorFn = (accumulator, item) => accumulator.concat(item);
    const countries = filteredCountryClusters.reduce(aggregatorFn, []);

    const unique = [...new Set(countries)].sort();

    const counterFn = item => countries.filter(other => comparatorFn(item, other)).length;
    const formatterFn = item => ({ id: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }

  getCountryTableData(): Array<any> {
    const extractorAuthorFn = item => item.authors.map(item => item.institution);
    const institutionClusters = this._specification.documents.map(extractorAuthorFn);

    const retrieverFn = item => this._countryRepository.findByName(item.country).country_name;
    const countryClusters = institutionClusters.map(items => items.map(retrieverFn));
    
    const comparatorFn = (item, other) => other === item;
    const filterFn = (item, index, self) => index === self.findIndex(other => comparatorFn(item, other));
    const filteredCountryClusters = countryClusters.map(items => items.filter(filterFn));

    const aggregatorFn = (accumulator, item) => accumulator.concat(item);
    const countries = filteredCountryClusters.reduce(aggregatorFn, []);

    const unique = [...new Set(countries)].sort();

    const counterFn = item => countries.filter(other => comparatorFn(item, other)).length;
    const formatterFn = item => ({ country: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }
  
}
