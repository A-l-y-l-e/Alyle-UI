import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReactiveFormComponent } from './select-reactive-form.component';

describe('SelectReactiveFormComponent', () => {
  let component: SelectReactiveFormComponent;
  let fixture: ComponentFixture<SelectReactiveFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectReactiveFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
