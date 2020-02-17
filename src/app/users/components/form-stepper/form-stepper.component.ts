import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { FileUploadValidators } from '@iplab/ngx-file-upload';

import {
  NAME_PATTERN,
  PHONE_PATTERN,
  EMAIL_PATTERN,
  CITY_PATTERN,
  STREET_PATTERN,
  ZIPCODE_PATTERN,
  STATE_PATTERN,
  STATE_SHORT_PATTERN,
} from '@app/utils';
import { UsersService } from '@app/users/services';
import { UserModel } from '@app/users/models';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss']
})

export class FormStepperComponent implements OnInit {

  @Input()
  public initialData: UserModel | void;

  public formGroup: FormGroup;

  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _usersService: UsersService,
  ) {}

  public ngOnInit(): void {
    this._formInitialization();
    this._onValueChanges();
    this._getValueChanges();
  }

  public submit(): void {
    // this.submitStepper.emit();
  }

  private _onValueChanges(): void {
    this.formGroup.valueChanges
      .subscribe({
        next: formData => {
          console.log('FormStepperComponent _onValueChanges', formData);
          this._usersService
            .patchUserForm(this._convertToModel(formData),  'stepper');
        }
      });
  }

  private _getValueChanges(): void {
    this._usersService.userFormData$
      .pipe(
        filter(data => data.source !== 'stepper')
      )
      .subscribe({
        next: data => {
          console.log('FormStepperComponent _getValueChanges', data.userData)
          this._formUpdate(new UserModel(data.userData));
        }
      })
  }

  private _convertToModel (data): UserModel {
    return new UserModel({
      firstname: data.firstFormGroup.firstname,
      lastname: data.firstFormGroup.lastname,
      phone: data.firstFormGroup.phone,
      email: data.firstFormGroup.email,
      birthday: data.firstFormGroup.birthday,
      address: {
        state: {
          name: data.secondFormGroup.name,
          shortname: data.secondFormGroup.shortname,
        },
        city: data.secondFormGroup.city,
        street: data.secondFormGroup.street,
        zipcode: data.secondFormGroup.zipcode,
      },
      avatar: data.thirdFormGroup.avatar,
    })
  }

  private _formUpdate(data: UserModel): void {
    this.formGroup.patchValue({
      firstFormGroup: {
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        email: data.email,
        birthday: data.birthday,
      },
      secondFormGroup: {
        name: data.address.state.name,
        shortname: data.address.state.shortname,
        city: data.address.city,
        street: data.address.street,
        zipcode: data.address.zipcode,
      },
      thirdFormGroup: {
        avatar: data.avatar,
      }
    }, {
      emitEvent: false
    });
  }

  private _formInitialization(): void {
    this.formGroup = this._formBuilder.group({
      firstFormGroup: this._formBuilder.group({
        firstname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
        lastname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
        phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
        email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
        birthday: ['', [Validators.required]],
      }),
      secondFormGroup: this._formBuilder.group({
        name: ['', [Validators.required, Validators.pattern(STATE_PATTERN)]],
        shortname: ['', [Validators.required, Validators.pattern(STATE_SHORT_PATTERN)]],
        city: ['', [Validators.required, Validators.pattern(CITY_PATTERN)]],
        street: ['', [Validators.required, Validators.pattern(STREET_PATTERN)]],
        zipcode: ['', [Validators.required, Validators.pattern(ZIPCODE_PATTERN)]],
      }),
      thirdFormGroup: this._formBuilder.group({
        avatar: [null, [Validators.required, FileUploadValidators.filesLimit(1)]],
      }),
    })
  }
}
