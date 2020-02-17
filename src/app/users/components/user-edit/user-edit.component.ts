import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { GetUser, GetUsers } from '@store/actions';
import { IAppState } from '@store/state';
import { UserModel } from '../../models/user.model';
import { selectSelectedUser, selectUserList } from '@app/store/selectos';


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
    this._route.params
      .subscribe(params => {
        this._getUserData(params['id']);
      })
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public onSubmit(): void {
    if (this.formList.valid) {
      const newUser = new UserModel(this.formList.getRawValue());
      // this._usersService
      //   .addUser(newUser)
      //   .pipe(
      //     takeUntil(this._destroyed$)
      //   )
      //   .subscribe(() => {
      //     this._openSnackBar('New user added', 'Ok');
      //     this._router.navigate(['/users']);
      //   });
    }
  }

  private _getUserData(id: string): void {
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
            this._store.dispatch(new GetUser(+id));
          }
        },
        error: () => {},
        complete: () => {}
      })
  }

  private _openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }
}