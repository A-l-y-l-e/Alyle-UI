import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDisableComponent } from './select-disable.component';

describe('SelectDisableComponent', () => {
  let component: SelectDisableComponent;
  let fixture: ComponentFixture<SelectDisableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDisableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDisableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
