import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonExample03Component } from './button-example-03.component';

describe('ButtonExample03Component', () => {
  let component: ButtonExample03Component;
  let fixture: ComponentFixture<ButtonExample03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonExample03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonExample03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
