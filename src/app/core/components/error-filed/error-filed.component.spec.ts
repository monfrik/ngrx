import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFiledComponent } from './error-filed.component';

describe('ErrorFiledComponent', () => {
  let component: ErrorFiledComponent;
  let fixture: ComponentFixture<ErrorFiledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorFiledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFiledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
