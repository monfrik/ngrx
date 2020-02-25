import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { GetUsers } from '@store/actions';
import { IAppState } from '@store/state';
import { selectUserList, selectFilteredUsers } from '@store/selectos';
import { RouterParams } from '@core/interfaces';
import { convertDate } from '@app/utils';
import { UserModel } from '@app/users/models';



@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})

export class UsersTableComponent implements OnInit, OnDestroy {
  
  public users$: Observable<UserModel[]>;

  public filtredTable: MatTableDataSource<any>;
  public displayedColumns: string[] = [
    'position',
    'firstname',
    'lastname',
    'phone',
    'email',
    'birthday',
    'addressStateName',
    'addressCity',
    'addressStreet',
    'addressZipcode',
    'avatar',
    'actions',
  ];

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  private _destroyed$ = new Subject<void>();
  private _filter$ = new Subject<RouterParams>();

  public constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _store: Store<IAppState>,
  ) {}

  public ngOnInit(): void {
    this._initStoreSubsribe();
    this._subscribeFilter();
    this._getUsers();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public onApllyFilter(filtres: RouterParams): void {
    this._filter$.next(filtres);
  }

  private _initStoreSubsribe(): void {
    this.users$ = this._store
      .pipe(
        takeUntil(this._destroyed$),
        select(selectUserList),
      );
  }

  private _subscribeFilter(): void {
    this._filter$
      .pipe(
        takeUntil(this._destroyed$),
      )
      .subscribe({
        next: (filtres: RouterParams) => {
          const queryParams = this._getRouterParams(filtres);
          // console.log(queryParams)
          this._router.navigate(['/users'], { queryParams });
          this._store.dispatch(new GetUsers(queryParams))
        }
      })
  }

  private _getUsers(): void {
    this.users$
      .pipe(
        tap((data: UserModel[]) => {
          if (data === null) {
            this._filter$.next({});
            // this._store.dispatch(new GetUsers({}));
          }
        }),
        filter((data: UserModel[]) => !!data),
        takeUntil(this._destroyed$),
      )
      .subscribe({
        next: (data: UserModel[]) => {
          this.filtredTable = new MatTableDataSource(data);
          this.filtredTable.sort = this.sort;
          this.filtredTable.paginator = this.paginator;
        },
        error: () => {},
        complete: () => {},
      })
  }

  // private _filterTable(data: UserModel, filter): boolean {
  //   let condition = true;
  //   if (filter.usersId.length) {
  //     condition = condition && filter.usersId.includes(data.id);
  //   }

  //   if (filter.phone) {
  //     const userPhone = data.phone.replace(/[^\d]/, '');
  //     condition = condition && userPhone.includes(filter.phone);
  //   }

  //   if (filter.state) {
  //     condition = condition && filter.state === data.address.state.shortname;
  //   }

  //   if (filter.dateStart || filter.dateEnd) {
  //     const birthday = data.birthday.toISOString().slice(0,10);

  //     if (filter.dateStart) {
  //       condition = condition && convertDate(filter.dateStart) <= birthday;
  //     }

  //     if (filter.dateEnd) {
  //       condition = condition && convertDate(filter.dateEnd) >= birthday;
  //     }
  //   }

  //   return condition;
  // }

  private _getRouterParams(filtres: RouterParams): RouterParams {
    let routerParams: RouterParams = {};

    if (filtres.usersId && filtres.usersId.length) routerParams.usersId = filtres.usersId;
    if (filtres.phone) routerParams.phone = filtres.phone;
    if (filtres.state) routerParams.state = filtres.state;
    if (filtres.dateStart) routerParams.dateStart = convertDate(filtres.dateStart);
    if (filtres.dateEnd) routerParams.dateEnd = convertDate(filtres.dateEnd);

    return routerParams;
  }

  // private _initFiltres(): void {
  //   const usersId = this._activatedRoute.snapshot.queryParams.usersId || [];
  //   const phone = this._activatedRoute.snapshot.queryParams.phone || '';
  //   const state = this._activatedRoute.snapshot.queryParams.state || '';
  //   const dateStart = this._activatedRoute.snapshot.queryParams.dateStart || '';
  //   const dateEnd = this._activatedRoute.snapshot.queryParams.dateEnd || '';
    
  //   this._filter$.next({
  //     usersId,
  //     phone,
  //     state,
  //     dateStart,
  //     dateEnd,
  //   });
  // }

}
