import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDemoExample02Component } from './input-demo-example-02.component';

describe('InputDemoExample02Component', () => {
  let component: InputDemoExample02Component;
  let fixture: ComponentFixture<InputDemoExample02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDemoExample02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDemoExample02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
