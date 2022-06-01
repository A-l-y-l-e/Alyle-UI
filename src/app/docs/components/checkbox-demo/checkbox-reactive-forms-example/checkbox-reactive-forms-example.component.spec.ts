import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxReactiveFormsExampleComponent } from './checkbox-reactive-forms-example.component';

describe('CheckboxReactiveFormsExampleComponent', () => {
  let component: CheckboxReactiveFormsExampleComponent;
  let fixture: ComponentFixture<CheckboxReactiveFormsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxReactiveFormsExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxReactiveFormsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
