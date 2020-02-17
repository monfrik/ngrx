import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Store, select } from '@ngrx/store';

import { IAppState } from '@store/state';
import { GetUsers } from '@store/actions';
import { selectUserList } from '@store/selectos';
import { UserModel } from '@app/users/models';


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
  styleUrls: ['./users-table.component.scss']
})

export class UsersTableComponent implements OnInit, OnDestroy{

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

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
  
  private _destroyed$ = new Subject<void>();
  private _filter$ = new Subject<RouterParams>();

  constructor (
    private readonly _store: Store<IAppState>,
    private readonly _router: Router
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
          this.filtredTable.data = this.users.filter(el => this._filterTable(el, filtres));
        }
      })
  }

  private _getUsers(): void {
    this._store.dispatch(new GetUsers());
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
    // const usersId = this._route.snapshot.queryParams.usersId || [];
    // const phone = this._route.snapshot.queryParams.phone || '';
    // const state = this._route.snapshot.queryParams.state || '';
    // const dateStart = this._route.snapshot.queryParams.dateStart || '';
    // const dateEnd = this._route.snapshot.queryParams.dateEnd || '';
    
    // this._filter$.next({
    //   usersId,
    //   phone,
    //   state,
    //   dateStart,
    //   dateEnd,
    // });
  }
}
