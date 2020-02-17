import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  UsersTableComponent,
  UserEditComponent,
  UserNewComponent
} from './components';


const routes: Routes = [
  {
    path: '',
    component: UsersTableComponent,
  },
  {
    path: 'new',
    component: UserNewComponent,
  },
  {
    path: ':id',
    component: UserEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class UsersRoutingModule { }
