import { Component, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil, filter, tap, take } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { UsersService } from '@app/users/services';

import { GetUser, UpdateEditedUser, PatchEditedUser, ClearEditedUser } from '@store/actions';
import { selectEditedUser } from '@store/selectos';
import { IAppState } from '@store/state';
import { UserModel } from '@app/users/models';
import { TabDirective } from '@app/users/directives';


@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UsersService]
})

export class UserEditComponent implements OnInit, OnDestroy{

  @ViewChildren(TabDirective) tabs: QueryList<TabDirective>;

  public formStepper;
  public formList;
  public initialData: UserModel;

  private _destroy$ = new Subject<void>();
  private _submited = false;

  public constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _store: Store<IAppState>,
    private readonly _usersService: UsersService,
    private readonly _snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this._getUser(+this._activatedRoute.snapshot.params.id);
  }

  public ngOnDestroy(): void {
    this._destroy();

    if (!this._submited) {
      if (!confirm('Save data?')) {
        this._store.dispatch(new ClearEditedUser);
      }
    }
  }
  
  public onSubmit(user: UserModel): void {
    this._destroy();
    const newUser = this._getUserWithId(user);
    this._submited = true;
    this._store.dispatch(new UpdateEditedUser(newUser));
    this._router.navigate(['/users']);
    this._openSnackBar('User changed', 'Ok');
  }

  public onPacthFormList(user: UserModel): void {
    this._pacthUser({user, form: 'list'});
  }

  public onPacthFormStepper(user: UserModel): void {
    this._pacthUser({user, form: 'stepper'});
  }
  
  public onChangeTab() {
    const activeTab = this.tabs.find(tab => tab.isActive);
    this._usersService.changeTabEvent.emit(activeTab.tab);
  }
  
  private _pacthUser(userPayload: {user: UserModel, form: 'list' | 'stepper'}): void {
    const data = this._getUserWithId(userPayload.user);
    this._store.dispatch(new PatchEditedUser(data));
  }

  private _getUser(id: number): void {
    this._store
      .pipe(
        select(selectEditedUser),
        takeUntil(this._destroy$),
        filter((editedUser: UserModel) => !editedUser || editedUser.id !== id)
      )
      .subscribe({
        next: () => {
          this._store.dispatch(new GetUser(id));
        },
        error: () => {},
        complete: () => {},
      })
  }

  private _getUserWithId(user: UserModel): UserModel {
    const id = +this._activatedRoute.snapshot.params.id;
    return {...user, ...{id}};
  }

  private _destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }

}