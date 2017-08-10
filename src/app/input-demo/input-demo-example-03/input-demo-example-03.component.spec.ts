import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDemoExample03Component } from './input-demo-example-03.component';

describe('InputDemoExample03Component', () => {
  let component: InputDemoExample03Component;
  let fixture: ComponentFixture<InputDemoExample03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDemoExample03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDemoExample03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
