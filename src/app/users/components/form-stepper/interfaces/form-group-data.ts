export interface FormStepperData {
  firstFormGroup: FirstFormGroup;
  secondFormGroup: SecondFormGroup;
  thirdFormGroup: ThirdFormGroup;
}

export interface FirstFormGroup {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  birthday: Date;
}

export interface SecondFormGroup {
  name: string;
  shortname: string;
  city: string;
  street: string;
  zipcode: string;
}

export interface ThirdFormGroup {
  avatar: any;
}