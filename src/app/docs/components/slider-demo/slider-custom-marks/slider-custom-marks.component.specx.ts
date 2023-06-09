import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderCustomMarksComponent } from './slider-custom-marks.component';

describe('SliderCustomMarksComponent', () => {
  let component: SliderCustomMarksComponent;
  let fixture: ComponentFixture<SliderCustomMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderCustomMarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderCustomMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
