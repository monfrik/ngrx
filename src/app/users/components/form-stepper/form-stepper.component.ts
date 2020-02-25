import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { FileUploadValidators } from '@iplab/ngx-file-upload';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { MatSnackBar } from '@angular/material';

import { UsersService } from '@app/users/services';

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

import { selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { UserModel } from '@app/users/models';
import { FormStepperData } from './interfaces';

@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormStepperComponent implements OnInit, OnDestroy {

  @Output()
  public submitStepper = new EventEmitter<UserModel>();

  @Output()
  public patchFormStepper = new EventEmitter<UserModel>();
  
  public editedUser$ = this._store.pipe(select(selectEditedUser));

  public formGroup: FormGroup;
  public firstGroupForm: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;

  private _destroy$ = new Subject<void>();
  private _submited = false;
  private _formChanged = false;

  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _store: Store<IAppState>,
    private readonly _usersService: UsersService,
    private readonly _snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this._changeTabSubscribe();
    this._formInitialization();
    this._getValueChanges();
    this._formSubscribe();
  }

  public ngOnDestroy(): void {
    this._patchUser();
    this._destroy();
  }

  public submit(): void {
    if (this.formGroup.valid) {
      if (this._formChanged) {
        this._submited = true;
        this._formChanged = false;
        this._destroy();
        const newUser = this._convertToModel(this.formGroup.value);
        this.submitStepper.emit(newUser);
      } else {
        this._openSnackBar('Nothing to update', 'Ok');
      }
    }
  }

  private _patchUser(): void {
    if (this.formGroup.touched && !this._submited && this._formChanged) {
      this._formChanged = false;
      this.patchFormStepper.emit(this._convertToModel(this.formGroup.value));
    }
  }

  private _getValueChanges(): void {
    this.editedUser$
      .pipe(
        takeUntil(this._destroy$),
        filter((editedUser: UserModel) => !!editedUser),
      )
      .subscribe({
        next: (user: UserModel) => {
          this._formUpdate(user);
          this._formChanged = false;
        },
        error: () => {},
        complete: () => {},
      })
  }

  private _convertToModel (formData: FormStepperData): UserModel {
    return new UserModel({
      firstname: formData.firstFormGroup.firstname,
      lastname: formData.firstFormGroup.lastname,
      phone: formData.firstFormGroup.phone,
      email: formData.firstFormGroup.email,
      birthday: formData.firstFormGroup.birthday,
      address: {
        state: {
          name: formData.secondFormGroup.name,
          shortname: formData.secondFormGroup.shortname,
        },
        city: formData.secondFormGroup.city,
        street: formData.secondFormGroup.street,
        zipcode: formData.secondFormGroup.zipcode,
      },
      avatar: formData.thirdFormGroup.avatar,
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
    });
  }

  private _destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _formInitialization(): void {
    this.firstGroupForm = this._formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastname: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      birthday: ['', [Validators.required]],
    }),

    this.secondFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(STATE_PATTERN)]],
      shortname: ['', [Validators.required, Validators.pattern(STATE_SHORT_PATTERN)]],
      city: ['', [Validators.required, Validators.pattern(CITY_PATTERN)]],
      street: ['', [Validators.required, Validators.pattern(STREET_PATTERN)]],
      zipcode: ['', [Validators.required, Validators.pattern(ZIPCODE_PATTERN)]],
    }),
    
    this.thirdFormGroup = this._formBuilder.group({
      avatar: [null],
    }),

    this.formGroup = this._formBuilder.group({
      firstFormGroup: this.firstGroupForm,
      secondFormGroup: this.secondFormGroup,
      thirdFormGroup: this.thirdFormGroup,
    })
  }

  private _changeTabSubscribe(): void {
    this._usersService.changeTabEvent
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: (tabName: string) => {
          if (tabName !== 'stepper') {
            this._patchUser();
          }
        },
        error: () => {},
        complete: () => {},
      });
  }

  private _formSubscribe(): void {
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: () => {
          this._formChanged = true;
        },
        error: () => {},
        complete: () => {},
      });
  }

  private _openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }

}
