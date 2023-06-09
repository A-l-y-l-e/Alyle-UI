import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassingDataToASnackBarComponent } from './passing-data-to-a-snack-bar.component';

describe('PassingDataToASnackBarComponent', () => {
  let component: PassingDataToASnackBarComponent;
  let fixture: ComponentFixture<PassingDataToASnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassingDataToASnackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassingDataToASnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
