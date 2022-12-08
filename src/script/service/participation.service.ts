import AbstractService from './abstract.service';

export default class ParticipationService extends AbstractService {

  getInstitutionTableData(): Array<any> {
    const extractorFn = item => item.authors.map(author => author.institution);
    const institutionClusters = this._specification.documents.map(extractorFn);

    const comparatorFn = (item, other) => other.name === item.name && other.country === item.country;
    const filterFn = (item, index, self) => index === self.findIndex(other => comparatorFn(item, other));
    const filteredInstitutionClusters = institutionClusters.map(items => items.filter(filterFn));

    const aggregatorFn = (accumulator, item) => accumulator.concat(item);
    const institutions = filteredInstitutionClusters.reduce(aggregatorFn, []);

    const unique = [...new Set(institutions.map(JSON.stringify))].map(JSON.parse);

    const counterFn = item => institutions.filter(other => comparatorFn(item, other)).length;
    const formatterFn = item => ({ institution: item.name, value: counterFn(item) });
    return unique.map(formatterFn);
  }

  getAuthorTableData(): Array<any> {
    const extractorFn = item => item.authors.map(author => author.name);
    const aggregatorFn = (accumulator, item) => accumulator.concat(...extractorFn(item));
    const authors = this._specification.documents.reduce(aggregatorFn, []);

    const unique = [...new Set(authors)];
    
    const counterFn = item => authors.filter(other => other === item).length;
    const formatterFn = item => ({ author: item, value: counterFn(item) });
    return unique.map(formatterFn);
  }
  
}
