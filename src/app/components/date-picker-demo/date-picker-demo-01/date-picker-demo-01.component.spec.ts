import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerDemo01Component } from './date-picker-demo-01.component';

describe('DatePickerDemo01Component', () => {
  let component: DatePickerDemo01Component;
  let fixture: ComponentFixture<DatePickerDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePickerDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
