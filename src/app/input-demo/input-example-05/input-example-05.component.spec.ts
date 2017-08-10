import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputExample05Component } from './input-example-05.component';

describe('InputExample05Component', () => {
  let component: InputExample05Component;
  let fixture: ComponentFixture<InputExample05Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputExample05Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputExample05Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
