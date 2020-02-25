import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class UsersService {

  /**
   * event value - name of tab
   */
  public changeTabEvent = new EventEmitter<string>();

}
