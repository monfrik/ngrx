import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';

import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';

import { UserModel } from '@app/users/models';

import {
  STATE_PATTERN,
  NAME_PATTERN,
  STATES,
} from '@app/utils';
import { RouterParams } from '@app/core/interfaces';


@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})

export class TableFilterComponent implements OnInit {

  @Input()
  public users: UserModel[] = [];

  @Output()
  public readonly applyFilter = new EventEmitter<RouterParams>();

  public filtersForm: FormGroup;
  public filteredUsers: UserModel[];
  public selectedUsers: UserModel[] = [];
  
  public readonly states = STATES;

  public dateStart: Date;
  public dateEnd = new Date();
  public readonly currentDate = new Date();

  private _destroyed$ = new Subject<void>();

  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this._initialisationForm();
    this._formSubscribe();
    this._initFiltres();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public get submitColor(): string {
    if (this.filtersForm.invalid && (this.filtersForm.dirty || this.filtersForm.touched)) {
      return 'warn';
    }
    return '';
  }

  public add(event: MatChipInputEvent): void {
    event.input.value = '';
    this.filtersForm.get('userName').setValue('');
  }

  public remove(user: UserModel): void {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUsers.push(this.users[event.option.value-1]);
    this.filtersForm.get('userName').setValue('');
  }

  public resetForm(): void {
    this.filtersForm.reset();
    const emitData = {
      usersId: [],
      state: '',
      phone: '',
      dateStart: '',
      dateEnd: '',
    }
    this.applyFilter.emit(emitData);
  }

  public submit(): void {
    if (this.filtersForm.invalid) {
      return;
    }

    const {dateStart, dateEnd, phone, state} = this.filtersForm.value;
    
    const usersId = this.selectedUsers.map(element => element.id);

    const currentState = STATES.find(element => element.name === state);
    const stateShort = currentState ? state.shortname : '';

    const emitData = {
      state: stateShort,
      usersId,
      phone,
      dateStart,
      dateEnd,
    }
    
    this.applyFilter.emit(emitData);
  }

  private _initialisationForm(): void {
    this.filtersForm = this._formBuilder.group({
      userName: ['', [Validators.pattern(NAME_PATTERN)]],
      phone: ['', [Validators.pattern(/^\d{1,10}$/)]],
      state: ['', [Validators.pattern(STATE_PATTERN)]],
      dateStart: [null],
      dateEnd: [null],
    });
  }

  private _formSubscribe(): void {
    this.filtersForm.get('userName')
      .valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        map((userName: string) => {
          this.filteredUsers = this._filterUsersByName(userName);
        })
      );

    this.filtersForm.get('dateStart')
      .valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        map((dateStart: Date | string) => {
          if (typeof dateStart === 'string') {
            return new Date(dateStart);
          }
          return dateStart;
        }),
      )
      .subscribe((dateStart: Date) => {
        this.dateStart = dateStart;
      });

    this.filtersForm.get('dateEnd')
      .valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        map((dateEnd: Date | string) => {
          if (typeof dateEnd === 'string') {
            return new Date(dateEnd);
          }
          return dateEnd;
        }),
      )
      .subscribe((dateEnd: Date)=> {
        this.dateStart = dateEnd;
      });
  }
  
  private _filterUsersByName(value: string): UserModel[] {
    const filterValue = value
    ? value.toLowerCase()
    : '';

    return this.users.filter((user: UserModel): boolean => {
      const userName = user.firstname.toLowerCase() + ' ' + user.lastname.toLowerCase();
      return userName.indexOf(filterValue) > -1;
    });
  }

  private _initFiltres(): void {
    const {usersId, phone, state, dateStart, dateEnd} = this._activatedRoute.snapshot.queryParams;
    
    const initState = STATES.find(el => el.shortname == state);
    
    this.filtersForm.patchValue({
      phone,
      dateStart,
      dateEnd,
      state: initState,
    });

    if (usersId) {
      if (typeof(usersId) === 'string') {
        this.selectedUsers.push(this.users[+usersId-1]);
      } else {
        usersId.forEach((idUser: string): void => {
          this.selectedUsers.push(this.users[+idUser-1]);
        });
      }
    }
    
  }

}
