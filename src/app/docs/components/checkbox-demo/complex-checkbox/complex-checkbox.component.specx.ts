import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexCheckboxComponent } from './complex-checkbox.component';

describe('ComplexCheckboxComponent', () => {
  let component: ComplexCheckboxComponent;
  let fixture: ComponentFixture<ComplexCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
