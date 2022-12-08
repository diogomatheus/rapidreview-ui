import ajv from 'ajv';
import yaml from 'js-yaml';
import headerHTML from 'bundle-text:./../../template/header.html';
import mainHTML from 'bundle-text:./../../template/main.html';
import footerHTML from 'bundle-text:./../../template/footer.html';
import pageLoadingHTML from 'bundle-text:./../../template/page-loading.html';
import pageDefaultHTML from 'bundle-text:./../../template/page-default.html';
import pageErrorHTML from 'bundle-text:./../../template/page-error.html';
import RapidReviewUIOptions from "./../dto/rapidreview-ui-options.dto";
import RapidReviewUIDirector from './../director/rapidreview-ui.director';
import RapidReviewUISchema from '../../resource/schema/rapidreview-schema.json';
import RapidReviewUIPackage from './../../../package.json';

export default class RapidReviewUIBundle {

  private _options: RapidReviewUIOptions;

  constructor(options: RapidReviewUIOptions) {
    this._options = this._getOptions(options);
  }

  async execute(): Promise<void> {
    const containerElement = document.getElementById(this._options.dom_id);
    if (containerElement === null) {
      console.log(`Rapid Review UI Bundle: dom_id (${this._options.dom_id}) container not found`);
      return;
    }

    const layoutComponents = this._options.layout === 'StandaloneLayout' ? [headerHTML, mainHTML, footerHTML] : [mainHTML];
    containerElement.innerHTML = layoutComponents.join('');

    if (this._options.layout === 'StandaloneLayout') {
      const inputElement = document.getElementById('rapidreview-ui-search-input');
      if (inputElement) {
        inputElement.value = this._options.url;
      }

      const buttonElement = document.getElementById('rapdireview-ui-search-button');
      if (buttonElement) {
        const onSearchEventHandler = async () => {
          const inputElement = document.getElementById('rapidreview-ui-search-input');
          this._buildContent(inputElement ? inputElement.value : '');
        };
        buttonElement.addEventListener('click', onSearchEventHandler);
      }

      const versionElement = document.getElementById('footer-version');
      if (versionElement) {
        versionElement.innerHTML = `@${RapidReviewUIPackage.version}`;
      }
    }

    await this._buildContent(this._options.url);
  }

  private async _buildContent(url): Promise<void> {
    const contentElement = document.getElementById('rapidreview-ui-content');
    if (contentElement) {
      contentElement.innerHTML = pageLoadingHTML;
    
      const specification = await this._loadSpecification(url);
      if (specification === null) {
        contentElement.innerHTML = pageErrorHTML;
        this._setErrorDetail('Specification file: load/parse error');
        return;
      }
  
      const builder = new ajv({ allErrors: true });
      const validator = builder.compile(RapidReviewUISchema);
      if (!validator(specification)) {
        contentElement.innerHTML = pageErrorHTML;
        this._setErrorDetail('Specification file: schema invalid', validator.errors);
        return;
      }
      
      contentElement.innerHTML = pageDefaultHTML;
  
      const director = new RapidReviewUIDirector(url, specification);
      director.init();
    }
  }

  private async _loadSpecification(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (typeof response === 'object') {
        const content = await response.text();
        return await this._parseYAML(content) || await this._parseJSON(content);
      }
    } catch (error) {
      console.log(`Specification file: load/parse error, ${error}`);
    }
  
    return null;
  }

  private async _parseJSON(content): Promise<any> {
    try {
      const specification = JSON.parse(content);
      return typeof specification === 'object' ? specification : null;
    } catch (error) {
      console.log(`Specification file: load/parse error, ${error}`);
    }
  
    return null;
  }
  
  private async _parseYAML(content): Promise<any> {
    try {
      const specification = yaml.load(content);
      return typeof specification === 'object' ? specification : null;
    } catch (error) {
      console.log(`Specification file: load/parse error, ${error}`);
    }
  
    return null;
  }

  private async _setErrorDetail(message, errors): Promise<void> {
    const messageElement = document.getElementById('rapidreview-ui-error-message');
    if (messageElement) {
      messageElement.innerHTML = message;
    }

    const listElement = document.getElementById('rapidreview-ui-error-list');    
    if (listElement) {
      const listItems = [];
      if (Array.isArray(errors) && errors.length) {
        for (const error of errors) {
          listItems.push(`<div class="alert alert-warning" role="alert">Location: ${error.instancePath}<br/>Error message: ${error.message}</div>`);
        }
      }

      listElement.innerHTML = listItems.join('');
    }
  }

  private _getOptions(options: RapidReviewUIOptions): RapidReviewUIOptions {
    const dom_id = options.dom_id && options.dom_id.trim() ? options.dom_id.trim() : 'rapidreview-ui';
    const queryConfigEnabled = typeof options.queryConfigEnabled === 'boolean' ? options.queryConfigEnabled : false;
    const layout = ['BaseLayout','StandaloneLayout'].includes(options.layout) ? options.layout : 'BaseLayout';
  
    let url = options.url && options.url.trim() ? options.url.trim() : 'rapidreview.yaml';
    if (queryConfigEnabled === true) {
      const querystringParameters = new URLSearchParams(window.location.search);
      const queryURL = querystringParameters.get('url');
      url = queryURL && queryURL.trim() ? queryURL.trim() : url;
    }
  
    return { dom_id, queryConfigEnabled, url, layout };
  }

}
