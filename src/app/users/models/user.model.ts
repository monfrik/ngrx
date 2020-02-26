import { AddressModel } from './address.model';

export class UserModel {
  public id: number;
  public firstname: string;
  public lastname: string;
  public phone: string;
  public email: string;
  public birthday: Date;
  public address: AddressModel;
  public avatar: any;

  public constructor(data: any = {}) {
    this.id = data.id || void 0;
    this.firstname = data.firstname || void 0;
    this.lastname = data.lastname || void 0;
    this.phone = data.phone || void 0;
    this.email = data.email || void 0;
    this.birthday = new Date(data.birthday) || void 0;
    this.avatar = data.avatar || void 0;
    this.address = data.address ? new AddressModel(data.address) : void 0;
  }
}
