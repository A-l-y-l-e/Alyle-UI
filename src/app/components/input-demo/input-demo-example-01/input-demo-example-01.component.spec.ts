import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDemoExample01Component } from './input-demo-example-01.component';

describe('InputDemoExample01Component', () => {
  let component: InputDemoExample01Component;
  let fixture: ComponentFixture<InputDemoExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDemoExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDemoExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
