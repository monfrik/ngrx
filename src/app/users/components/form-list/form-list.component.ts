import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
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

import { Store, select } from '@ngrx/store';

import { MatSnackBar } from '@angular/material';

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

import { selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { UserModel } from '@app/users/models';


@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// provide store data via input
export class FormListComponent implements OnInit, OnDestroy {

  @Output()
  public submitList = new EventEmitter<UserModel>();

  @Output()
  public patchFormList = new EventEmitter<UserModel>();

  public editedUser$ = this._store.pipe(select(selectEditedUser));

  public phoneMask: (string | RegExp)[] = PHONE_MASK;
  public zipcodeMask: (string | RegExp)[] = ZIPCODE_MASK;
  public states = STATES;

  public formGroup: FormGroup;

  private _destroy$ = new Subject<void>();
  private _submited = false;
  private _formChanged = false;
  
  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _store: Store<IAppState>,
    private readonly _usersService: UsersService,
    private readonly _snackBar: MatSnackBar,
  ) {}

  public get address(): AbstractControl {
    return this.formGroup.get('address');
  }

  public get state(): AbstractControl {
    return this.formGroup.get('address').get('state');
  }

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
        this._formChanged = false;
        this._submited = true;
        this._destroy();
        this.submitList.emit(new UserModel(this.formGroup.value));
      } else {
        this._openSnackBar('Nothing to update', 'Ok');
      }
    }
  }

  public onChangeSelect(stateName: string): void {
    const currentState = STATES.find(state => state.name === stateName);
    this.state.get('shortname').patchValue(currentState.shortname);
  }

  private _patchUser(): void {
    if (this.formGroup.touched && !this._submited && this._formChanged) {
      this._formChanged = false;
      this.patchFormList.emit(new UserModel(this.formGroup.value));
    }
  }

  private _getValueChanges(): void {
    this.editedUser$
      .pipe(
        takeUntil(this._destroy$),
        filter((editedUser: UserModel) => !!editedUser),
      )
      .subscribe({
        next: (editedUser: UserModel) => {
          this.formGroup.patchValue(editedUser);
          this._formChanged = false;
        },
        error: () => {},
        complete: () => {},
      })
  }

  private _destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _formInitialization(): void {
    this.formGroup = this._formBuilder.group({
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

  private _changeTabSubscribe(): void {
    this._usersService.changeTabEvent
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe({
        next: (tabName: string) => {
          if (tabName !== 'list') {
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
/*
+ Избавиться от source
+ выпилить selectedUser 
+ если нет выбранного пользователя в списке, то брать с бекенда
- на userTable получать сразу отфильтрованные данные (отправлять параметры в сторе через экшен. Фильтровать в редьюсере)
- создать новую ветку store entities (@ngrx/data)
*/