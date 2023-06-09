import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTypesDemoComponent } from './button-types-demo.component';

describe('ButtonTypesDemoComponent', () => {
  let component: ButtonTypesDemoComponent;
  let fixture: ComponentFixture<ButtonTypesDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonTypesDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonTypesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
