import countries from '../../resource/data/countries.json';

export default class CountryRepository {

  findByCode(code: string): any {
    return countries.find((country) => country.country_code === code);
  }

  findByName(name: string): any {
    return countries.find((country) => country.country_name === name);
  }

  findAll(): any[] {
    return countries;
  }

  findAllByContinentCode(code: string): any[] {
    return countries.filter((country) => country.continent_code === code);
  }

  findAllByContinentName(name: string): any[] {
    return countries.filter((country) => country.continent_name === name);
  }

}
