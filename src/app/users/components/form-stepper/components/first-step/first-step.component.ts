import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PHONE_MASK } from '@app/utils';


@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss']
})

export class FirstStepComponent {

  public phoneMask: (string | RegExp)[] = PHONE_MASK;

  @Input()
  public formGroup: FormGroup;

}
