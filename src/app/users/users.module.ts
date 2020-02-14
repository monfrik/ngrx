import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './components';

import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    UsersTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    UsersTableComponent
  ]
})
export class UsersModule { }
