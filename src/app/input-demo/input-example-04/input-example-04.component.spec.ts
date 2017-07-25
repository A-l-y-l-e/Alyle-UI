import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputExample04Component } from './input-example-04.component';

describe('InputExample04Component', () => {
  let component: InputExample04Component;
  let fixture: ComponentFixture<InputExample04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputExample04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputExample04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
