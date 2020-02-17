import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Subject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { FileUploadValidators } from '@iplab/ngx-file-upload';

import { UsersService } from '@app/users/services';
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

import { UserModel } from '@app/users/models';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@store/state';
import { selectSelectedUser, selectEditedUser } from '@store/selectos';
import { PatchEditedUser } from '@app/store/actions';


interface ControlData {
  control: AbstractControl;
  key: string;
  source: 'stepper' | 'list' | 'service';
  callback?: any;
}

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormListComponent implements OnInit {

  public user$ = this._store.pipe(select(selectSelectedUser));
  public editedUser$ = this._store.pipe(select(selectEditedUser));
  public phoneMask: (string | RegExp)[] = PHONE_MASK;
  public zipcodeMask: (string | RegExp)[] = ZIPCODE_MASK;

  public states = STATES;

  public formGroup: FormGroup;

  private _destroyed$ = new Subject<void>();
  
  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _store: Store<IAppState>,
  ) {}

  public get address() {
    return this.formGroup.get('address');
  }

  public get state() {
    return this.formGroup.get('address').get('state');
  }

  public ngOnInit(): void {
    this._formInitialization();
    this._onValueChanges();
    this._getValueChanges();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public submit(): void {
    // this.submitList.emit();
  }

  public onChangeSelect(stateName): void {
    const currentState = STATES.find(element => element.name === stateName);
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
      },
      {
        control: this.state.get('name'),
        key: 'state',
        callback: value => STATES.find(element => element.name === value),
      },
      {
        control: this.address.get('city'),
        key: 'city',
      },
      {
        control: this.address.get('street'),
        key: 'street',
      },
      {
        control: this.address.get('zipcode'),
        key: 'zipcode',
      }
    ].forEach((element: ControlData) => {
      element.source = 'list';
      this._controlListener(element)
    });
  }

  /**
   *  function that subscribes to each given control and executes path value
   *  @param ControlData controller with options
   */
  private _controlListener(controlParams: ControlData): void {
    controlParams.control
      .valueChanges
      .pipe(
        takeUntil(this._destroyed$),
      )
      .subscribe({
        next: (value) => {
          if (controlParams.callback) {
            console.log('_controlListener valueChanges', controlParams.callback(value));
            this._store.dispatch(new PatchEditedUser(controlParams.callback(value)))
            // this._usersService
            //   .patchUserForm(controlParams.callback(value), controlParams.source);
          } else {
            console.log('_controlListener valueChanges', {[controlParams.key]: value});
            this._store.dispatch(new PatchEditedUser({[controlParams.key]: value}))
            // this._usersService
            //   .patchUserForm({[controlParams.key]: value}, controlParams.source);
          }
        }
      });
  }

  private _getValueChanges(): void {
    this.editedUser$
      .pipe(
        takeUntil(this._destroyed$),
        // filter(data => !!data)
        map(data => data || {})
      )
      .subscribe({
        next: (data) => {
          console.log('_getValueChanges editedUser = ', data)
          this.formGroup.patchValue(data, {
            emitEvent: false,
          });
        }
      })
    // this._usersService.userFormData$
    //   .pipe(
    //     filter(data => data.source !== 'list')
    //   )
    //   .subscribe({
    //     next: (data) => {
    //       console.log('FormListComponent _getValueChanges', data.userData)
    //       // this.formGroup.patchValue(data.userData, {
    //       //   emitEvent: false,
    //       // });
    //     }
    //   })
  }

  private _formInitialization(): void {
    this.formGroup = this._formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      avatar: [null, [Validators.required, FileUploadValidators.filesLimit(1)]],
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
