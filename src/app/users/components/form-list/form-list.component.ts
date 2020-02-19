import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { FileUploadValidators } from '@iplab/ngx-file-upload';

import { Store, select } from '@ngrx/store';

import {
  PHONE_MASK,
  ZIPCODE_MASK,

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

import { PatchEditedUser, UpdateSelectedUser } from '@store/actions';
import { selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { UserModel } from '@app/users/models';

import { EditedUser, EditedUserPayload } from '@core/interfaces';


interface ControlData {
  control: AbstractControl;
  key: string;
  callback?: Function;
}

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormListComponent implements OnInit, OnDestroy {

  public editedUser$ = this._store.pipe(select(selectEditedUser));

  public phoneMask: (string | RegExp)[] = PHONE_MASK;
  public zipcodeMask: (string | RegExp)[] = ZIPCODE_MASK;
  public states = STATES;

  public formGroup: FormGroup;

  private _destroyed$ = new Subject<void>();
  
  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _store: Store<IAppState>,
    private readonly _router: Router,
  ) {}

  public get address(): AbstractControl {
    return this.formGroup.get('address');
  }

  public get state(): AbstractControl {
    return this.formGroup.get('address').get('state');
    this._destroyed$.complete();
  }

  public ngOnInit(): void {
    this._formInitialization();
    this._onValueChanges();
    this._getValueChanges();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
    this._patchEditedUser({data: {}, source: 'state'});
  }

  public submit(): void {
    if (this.formGroup.valid) {
      this._destroyed$.next();
      this._destroyed$.complete();
      this._store.dispatch(new UpdateSelectedUser(new UserModel(this.formGroup.value)));
      // this._router.navigate(['/users']);
    }
    // this.submitList.emit();
  }

  public onChangeSelect(stateName: string): void {
    const currentState = STATES.find(state => state.name === stateName);
    this.state.get('shortname').patchValue(currentState.shortname);
  }

  private _onValueChanges(): void {
    [
      {
        control: this.formGroup.get('firstname'),
        key: 'firstname',
      },
      {
        control: this.formGroup.get('lastname'),
        key: 'lastname',
      },
      {
        control: this.formGroup.get('phone'),
        key: 'phone',
      },
      {
        control: this.formGroup.get('email'),
        key: 'email',
      },
      {
        control: this.formGroup.get('birthday'),
        key: 'birthday',
      },
      {
        control: this.formGroup.get('avatar'),
        key: 'avatar',
        callback: value => {return {avatar: value[0]}}
      },
      {
        control: this.state.get('name'),
        key: 'state',
        callback: value => {
          return {
            address: {
              ...this.address.value,
              state: {
                ...STATES.find(element => element.name === value)
              }
            }
          }
        },
      },
      {
        control: this.address.get('city'),
        key: 'city',
        callback: city => {
          return {
            address: {
              ...this.address.value,
              city
            }
          }
        },
      },
      {
        control: this.address.get('street'),
        key: 'street',
        callback: street => {
          return {
            address: {
              ...this.address.value,
              street
            }
          }
        },
      },
      {
        control: this.address.get('zipcode'),
        key: 'zipcode',
        callback: zipcode => {
          return {
            address: {
              ...this.address.value,
              zipcode
            }
          }
        },
      }
    ].forEach((element: ControlData) => {
      this._controlListener(element)
    });
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

          this._patchEditedUser({data: patchValue, source: 'list'});
        },
        error: () => {},
        complete: () => {},
      });
  }

  private _getValueChanges(): void {
    this.editedUser$
      .pipe(
        takeUntil(this._destroyed$),
        filter((editedUser: EditedUser) => !!editedUser && editedUser.source !== 'list'),
        map((editedUser: EditedUser) => editedUser.data),
      )
      .subscribe({
        next: (data: UserModel) => {
          this.formGroup.patchValue(data, {
            emitEvent: false,
          });
        },
        error: () => {},
        complete: () => {},
      })
  }

  private _patchEditedUser(data: EditedUserPayload): void {
    this._store.dispatch(new PatchEditedUser(data));
  }

  private _formInitialization(): void {
    this.formGroup = this._formBuilder.group({
      id: [''],
      firstname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      // avatar: [null, [Validators.required, FileUploadValidators.filesLimit(1)]],
      avatar: [null, []],
      birthday: ['', [Validators.required]],
      address: this._formBuilder.group({
        state: this._formBuilder.group({
          name: ['', [Validators.required, Validators.pattern(STATE_PATTERN)]],
          shortname: ['', [Validators.required, Validators.pattern(STATE_SHORT_PATTERN)]],
        }),
        city: ['', [Validators.required, Validators.pattern(CITY_PATTERN)]],
        street: ['', [Validators.required, Validators.pattern(STREET_PATTERN)]],
        zipcode: ['', [Validators.required, Validators.pattern(ZIPCODE_PATTERN)]],
      })
    })
  }

}
