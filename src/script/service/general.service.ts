import AbstractService from './abstract.service';

export default class GeneralService extends AbstractService {

  getTitleGeneralData(): string {
    return this._specification.research.title;
  }

  getAbstractGeneralData(): string {
    return this._specification.research.abstract;
  }

  getKeywordsGeneralData(): Array<string> {
    const keywords = this._specification.research.keywords;
    return keywords ? keywords : [];
  }

  getKeywordsGeneralDataFormatted(): string {
    return this.getKeywordsGeneralData().map(keyword => `<span class="badge text-bg-info">${keyword}</span>`).join('&nbsp');
  }

}
