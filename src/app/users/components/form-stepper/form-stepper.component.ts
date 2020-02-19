import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { FileUploadValidators } from '@iplab/ngx-file-upload';

import { Subject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import {
  NAME_PATTERN,
  PHONE_PATTERN,
  EMAIL_PATTERN,
  CITY_PATTERN,
  STREET_PATTERN,
  ZIPCODE_PATTERN,
  STATE_PATTERN,
  STATE_SHORT_PATTERN,
  STATES,
} from '@app/utils';

import { PatchEditedUser } from '@store/actions';
import { selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { EditedUser, EditedUserPayload } from '@core/interfaces';
import { UserModel } from '@app/users/models';


interface ControlData {
  control: AbstractControl;
  key: string;
  callback?: Function;
}

@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
})

export class FormStepperComponent implements OnInit, OnDestroy {

  @Output()
  public submitStepper = new EventEmitter<UserModel>();
  
  public editedUser$ = this._store.pipe(select(selectEditedUser));

  public formGroup: FormGroup;
  public firstGroupForm: FormGroup;

  private _destroyed$ = new Subject<void>();

  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _store: Store<IAppState>,
  ) {}

  get firstNameControl(): AbstractControl {
    return this.firstGroupForm.get('firstname'),
  }

  public ngOnInit(): void {
    this._formInitialization();
    this._onValueChanges();
    this._getValueChanges();
  }

  public ngOnDestroy(): void {
    this._destroy();
  }

  public submit(): void {
    if (this.formGroup.valid) {
      const userModel = this._convertToModel(this.formGroup.value);
      this._destroy();
      this.submitStepper.emit(userModel);
    }
  }

  //  update store on tab change
  private _onValueChanges(): void {
    [
      {
        control: this.firstNameControl,
        key: 'firstname',
      },
      {
        control: this.formGroup.get('firstFormGroup').get('lastname'),
        key: 'lastname',
      },
      {
        control: this.formGroup.get('firstFormGroup').get('phone'),
        key: 'phone',
      },
      {
        control: this.formGroup.get('firstFormGroup').get('email'),
        key: 'email',
      },
      {
        control: this.formGroup.get('firstFormGroup').get('birthday'),
        key: 'birthday',
      },
      {
        control: this.formGroup.get('thirdFormGroup').get('avatar'),
        key: 'avatar',
        callback: (value: File[]) => {return {avatar: value[0]}}
      },
      {
        control: this.formGroup.get('secondFormGroup').get('name'),
        key: 'state',
        callback: (state: string) => {
          const {city, street, zipcode} = this.formGroup.get('secondFormGroup').value;
          return {
            address: {
              city,
              street,
              zipcode,
              state: {
                ...STATES.find(element => element.name === state)
              }
            }
          }
        },
      },
      {
        control: this.formGroup.get('secondFormGroup').get('city'),
        key: 'city',
        callback: (city: string) => {
          const {state, street, zipcode} = this.formGroup.get('secondFormGroup').value;
          return {
            address: {
              street,
              zipcode,
              state,
              city,
            }
          }
        },
      },
      {
        control: this.formGroup.get('secondFormGroup').get('street'),
        key: 'street',
        callback: (street: string) => {
          const {city, state, zipcode} = this.formGroup.get('secondFormGroup').value;
          return {
            address: {
              city,
              zipcode,
              state,
              street,
            }
          }
        },
      },
      {
        control: this.formGroup.get('secondFormGroup').get('zipcode'),
        key: 'zipcode',
        callback: (zipcode: string) => {
          const {city, street, state} = this.formGroup.get('secondFormGroup').value;
          return {
            address: {
              city,
              street,
              state,
              zipcode,
            }
          }
        },
      }
    ].forEach((element: ControlData) => {
      this._controlListener(element)
    });
  }

  private _getValueChanges(): void {
    this.editedUser$
      .pipe(
        takeUntil(this._destroyed$),
        filter((editedUser: EditedUser) => {
          return !!editedUser && !!editedUser.data && editedUser.source !== 'stepper';
        }),
        map((editedUser: EditedUser) => editedUser.data),
      )
      .subscribe({
        next: (editedUserData: UserModel) => {
          this._formUpdate(editedUserData);
        },
        error: () => {},
        complete: () => {},
      })
  }

  /**
   *  function that subscribes to each given control and executes PatchEditedUser
   *  @param ControlData controller with options
   */
  private _controlListener(controlParams: ControlData): void {
    controlParams.control
      .valueChanges
      .pipe(
        takeUntil(this._destroyed$),
      )
      .subscribe({
        next: (value: any) => {
          const patchValue = controlParams.callback
          ? controlParams.callback(value)
          : {[controlParams.key]: value};

          this._patchEditedUser({data: patchValue, source: 'stepper'});
        },
        error: () => {},
        complete: () => {},
      });
  }

  private _convertToModel (data): UserModel {
    return new UserModel({
      id: data.firstFormGroup.id,
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
});

  // emit event after deleting _onValueChanges
  private _formUpdate(data: UserModel): void {
    this.formGroup.patchValue({
      firstFormGroup: {
        id: data.id,
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

  private _patchEditedUser(data: EditedUserPayload): void {
    this._store.dispatch(new PatchEditedUser(data));
  }

  private _destroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private _formInitialization(): void {
    this.firstGroupForm =this._formBuilder.group({
      id: [''],
      firstname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      birthday: ['', [Validators.required]],
    }),

    this.formGroup = this._formBuilder.group({
      firstFormGroup: this.firstGroupForm,
      secondFormGroup: this._formBuilder.group({
        name: ['', [Validators.required, Validators.pattern(STATE_PATTERN)]],
        shortname: ['', [Validators.required, Validators.pattern(STATE_SHORT_PATTERN)]],
        city: ['', [Validators.required, Validators.pattern(CITY_PATTERN)]],
        street: ['', [Validators.required, Validators.pattern(STREET_PATTERN)]],
        zipcode: ['', [Validators.required, Validators.pattern(ZIPCODE_PATTERN)]],
      }),
      thirdFormGroup: this._formBuilder.group({
        avatar: [null],
      }),
    })
  }
}
