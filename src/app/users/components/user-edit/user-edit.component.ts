import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { EditedUserPayload } from '@core/interfaces';
import { GetUser, GetUsers, UpdateSelectedUser, PatchEditedUser } from '@store/actions';
import { selectUserList, selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { UserModel } from '@app/users/models';


@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})

export class UserEditComponent implements OnInit, OnDestroy{
  public formStepper;
  public formList;
  public initialData: UserModel;

  private _destroyed$ = new Subject<void>();

  public constructor(
    private readonly _router: Router,
    private readonly _snackBar: MatSnackBar,
    private readonly _route: ActivatedRoute,
    private readonly _store: Store<IAppState>,
  ) {}

  public ngOnInit(): void {
    //  snapshot
    this._route.paramMap
      .subscribe(params => {
        this._getUser(+params.get('id'));
      })
  }

  public ngOnDestroy(): void {
    this._destroy();
    if (confirm('Save data?')) {
      this._patchEditedUser({source: 'state'});
    } else {
      this._patchEditedUser({data: null, source: 'state'});
    }
  }
  
  public onSubmit(user: UserModel): void {
    this._destroy();
    this._store.dispatch(new UpdateSelectedUser(user));
    this._router.navigate(['/users']);
    this._openSnackBar('User changed', 'Ok');
  }

  private _getUser(id: number): void {
    this._store
      .pipe(
        select(selectEditedUser),
        takeUntil(this._destroyed$),
        filter(editedUser => !editedUser || !editedUser.data || editedUser.data.id !== id)
      )
      .subscribe({
        next: (data: any) => {
          this._fetchUser(id);
        },
        error: () => {},
        complete: () => {},
      })
  }

  //  make async action
  private _fetchUser(id: number): void {
    this._store
      .pipe(
        select(selectUserList),
        takeUntil(this._destroyed$)
      )
      .subscribe({
        next: (data) => {
          if (!data) {
            this._store.dispatch(new GetUsers());
          } else {
            this._store.dispatch(new GetUser(id));
          }
        },
        error: () => {},
        complete: () => {}
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

  private _destroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}