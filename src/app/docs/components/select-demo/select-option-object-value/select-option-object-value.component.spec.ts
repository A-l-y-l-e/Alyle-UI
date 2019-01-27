import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionObjectValueComponent } from './select-option-object-value.component';

describe('SelectOptionObjectValueComponent', () => {
  let component: SelectOptionObjectValueComponent;
  let fixture: ComponentFixture<SelectOptionObjectValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOptionObjectValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOptionObjectValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
