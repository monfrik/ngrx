import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { UserModel } from '../../models/user.model';
import { convertDate } from '@app/utils';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@app/store/state';
import { GetUsers } from '@app/store/actions';
import { selectUserList } from '@app/store/selectos';


interface RouterParams {
  usersId?: number[] | string[];
  phone?: string;
  state?: string;
  dateStart?: string | Date;
  dateEnd?: string | Date;
}


@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})

export class UsersTableComponent implements OnInit, OnDestroy {
  
  public users$ = this._store.pipe(select(selectUserList));
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
    private readonly _route: ActivatedRoute,
    private readonly _store: Store<IAppState>,
  ) {}

  public ngOnInit(): void {
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

  private _subscribeFilter(): void {
    this._filter$
      .pipe(
        takeUntil(this._destroyed$)
      )
      .subscribe({
        next: (filtres: RouterParams) => {
          const queryParams = this._getRouterParams(filtres);
          this._router.navigate(['/users'], { queryParams });
          this.users$
            .pipe(
              filter(data => !!data)
            )
            .subscribe((users) => {
            console.log('_subscribeFilter', users)
            this.filtredTable.data = users.filter(el => this._filterTable(el, filtres));
          })
        }
      })
  }

  private _getUsers(): void {
    this._store.dispatch(new GetUsers());
    this.users$
      .pipe(
        map(data => data || [])
      )
      .subscribe({
        next: (data: UserModel[]) => {
          console.log('_getUsers', data);
          this.filtredTable = new MatTableDataSource(data);
          this.filtredTable.sort = this.sort;
          this.filtredTable.paginator = this.paginator;
        },
        error: () => {},
        complete: () => {},
      })
    this._initFiltres();
  }

  private _filterTable(data: UserModel, filter): boolean {
    let condition = true;
    if (filter.usersId.length) {
      condition = condition && filter.usersId.includes(data.id);
    }

    if (filter.phone) {
      const userPhone = data.phone.replace(/[^\d]/, '');
      condition = condition && userPhone.includes(filter.phone);
    }

    if (filter.state) {
      condition = condition && filter.state === data.address.state.shortname;
    }

    if (filter.dateStart || filter.dateEnd) {
      const birthday = data.birthday.toISOString().slice(0,10);

      if (filter.dateStart) {
        condition = condition && convertDate(filter.dateStart) <= birthday;
      }

      if (filter.dateEnd) {
        condition = condition && convertDate(filter.dateEnd) >= birthday;
      }
    }

    return condition;
  }

  private _getRouterParams(filtres: RouterParams): RouterParams {
    let routerParams: RouterParams = {};

    if (filtres.usersId.length) routerParams.usersId = filtres.usersId;
    if (filtres.phone) routerParams.phone = filtres.phone;
    if (filtres.state) routerParams.state = filtres.state;
    if (filtres.dateStart) routerParams.dateStart = convertDate(filtres.dateStart);
    if (filtres.dateEnd) routerParams.dateEnd = convertDate(filtres.dateEnd);

    return routerParams;
  }

  private _initFiltres(): void {
    const usersId = this._route.snapshot.queryParams.usersId || [];
    const phone = this._route.snapshot.queryParams.phone || '';
    const state = this._route.snapshot.queryParams.state || '';
    const dateStart = this._route.snapshot.queryParams.dateStart || '';
    const dateEnd = this._route.snapshot.queryParams.dateEnd || '';
    
    this._filter$.next({
      usersId,
      phone,
      state,
      dateStart,
      dateEnd,
    });
  }

}
