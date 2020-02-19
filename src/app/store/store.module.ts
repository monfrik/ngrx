import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// import { UsersService } from '@app/users/services';
import { appReducers } from './reducers';
import { UserEffects } from './effects';
import { environment } from 'environments/environment';


@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([UserEffects]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !environment.production ? StoreDevtoolsModule.instrument(): [],
  ],
  // providers: [UsersService]
})
export class AppStoreModule { }
