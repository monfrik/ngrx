import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ZIPCODE_MASK, STATES } from '@app/utils';


@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss']
})

export class SecondStepComponent {

  public mask: (string | RegExp)[] = ZIPCODE_MASK;

  public states = STATES;

  @Input()
  public formGroup: FormGroup;

  public onChangeSelect(stateName): void {
    const currentState = STATES.find(element => element.name === stateName);
    this.formGroup.get('shortname').patchValue(currentState.shortname);
  }

}
