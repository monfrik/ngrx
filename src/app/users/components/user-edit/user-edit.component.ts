import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil, filter, tap, take } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { UsersService } from '@app/users/services';

import { EditedUserPayload, EditedUser } from '@core/interfaces';
import { GetUser, UpdateSelectedUser, PatchEditedUser } from '@store/actions';
import { selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { UserModel } from '@app/users/models';


@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UsersService]
})

export class UserEditComponent implements OnInit, OnDestroy{
  public formStepper;
  public formList;
  public initialData: UserModel;

  private _destroy$ = new Subject<void>();

  public constructor(
    private readonly _router: Router,
    private readonly _snackBar: MatSnackBar,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _store: Store<IAppState>,
    private readonly _usersService: UsersService,
  ) {}

  public ngOnInit(): void {
    this._getUser(+this._activatedRoute.snapshot.params.id);
  }

  public ngOnDestroy(): void {
    this._destroy();

    this._store
      .pipe(
        take(1),
        select(selectEditedUser),
      )
      .subscribe({
        next: (editedUser: EditedUser) => {
          if (editedUser.source !== 'state') {
            if (confirm('Save data?')) {
              this._patchEditedUser({source: 'state'});
            } else {
              this._patchEditedUser({data: null, source: 'state'});
            }
          }
        },
        error: () => {},
        complete: () => {},
      })
  }
  
  public onSubmit(user: UserModel): void {
    this._destroy();
    const newUser = this._getUserWithId(user);
    this._store.dispatch(new UpdateSelectedUser(newUser));
    this._router.navigate(['/users']);
    this._openSnackBar('User changed', 'Ok');
  }
  
  public onPacthUser(userPayload: EditedUser): void {
    const data = this._getUserWithId(userPayload.data);
    this._patchEditedUser({data, source: userPayload.source});
  }

  public onChangeTab(event) {
    this._usersService.changeTabEvent.emit(event.index);
  }

  private _getUser(id: number): void {
    this._store
      .pipe(
        select(selectEditedUser),
        takeUntil(this._destroy$),
        filter(editedUser => !editedUser || !editedUser.data || editedUser.data.id !== id)
      )
      .subscribe({
        next: () => {
          this._store.dispatch(new GetUser(id));
        },
        error: () => {},
        complete: () => {},
      })
  }

  private _patchEditedUser(data: EditedUserPayload): void {
    this._store.dispatch(new PatchEditedUser(data));
  }

  private _openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }

  private _getUserWithId(user: UserModel): UserModel {
    const id = +this._activatedRoute.snapshot.params.id;
    return {...user, ...{id}};
  }

  private _destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}