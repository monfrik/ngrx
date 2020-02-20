import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class UsersService {

  /**
   * event value - index of tab
   */
  public changeTabEvent = new EventEmitter<number>();

}
