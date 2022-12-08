import AbstractService from './abstract.service';

export default class DatasetService extends AbstractService {

  getSelectedDocumentsTableData(): Array<any> {
    const formatterFn = item => ({ title: item.title, year: item.year });
    return this._specification.documents.map(formatterFn);
  }
  
}
