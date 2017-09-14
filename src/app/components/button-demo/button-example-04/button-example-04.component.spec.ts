import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonExample04Component } from './button-example-04.component';

describe('ButtonExample04Component', () => {
  let component: ButtonExample04Component;
  let fixture: ComponentFixture<ButtonExample04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonExample04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonExample04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
