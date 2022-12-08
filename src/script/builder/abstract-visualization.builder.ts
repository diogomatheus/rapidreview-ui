export default abstract class AbstractVisualizationBuilder {

  protected _containerId: string;
  protected _data: any;

  constructor(containerId: string) {
    this._containerId = containerId;
    this.reset();
  }

  reset(): any {
    this._data = [];
    return this;
  }

  setData(data: any): any {
    this._data = data;
    return this;
  }

  abstract build(): any;
  
}
