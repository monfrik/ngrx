import { StateModel } from './state.model';

export class AddressModel {
  public state: StateModel;
  public city: string;
  public street: string;
  public zipcode: string;

  public constructor(data: any = {}) {
    this.state = data.state ? new StateModel(data.state) : void 0;
    this.city = data.city || void 0;
    this.street = data.street || void 0;
    this.zipcode = data.zipcode || void 0;
  }
}
