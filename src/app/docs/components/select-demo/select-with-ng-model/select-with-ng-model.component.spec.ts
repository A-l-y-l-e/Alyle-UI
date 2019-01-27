import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithNgModelComponent } from './select-with-ng-model.component';

describe('SelectWithNgModelComponent', () => {
  let component: SelectWithNgModelComponent;
  let fixture: ComponentFixture<SelectWithNgModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWithNgModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWithNgModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
