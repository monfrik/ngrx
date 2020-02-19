import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { UsersService } from '../../services';
import { UserModel } from '../../models/user.model';


@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss'],
  // providers: [ UsersService ]
})

export class UserNewComponent implements OnDestroy {

  public formStepper;
  public formList;

  private _destroyed$ = new Subject<void>();

  public constructor(
    private readonly _router: Router,
    private readonly _snackBar: MatSnackBar,
    // private readonly _usersService: UsersService,
  ) {}

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

  private _openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }

}
