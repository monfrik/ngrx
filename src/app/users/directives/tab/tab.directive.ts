import { Directive, Input, ElementRef } from '@angular/core';


@Directive({
  selector: '[tab]'
})
export class TabDirective {

  @Input()
  public tab: string;

  @Input()
  public isActive: boolean;

  constructor (){}

}
