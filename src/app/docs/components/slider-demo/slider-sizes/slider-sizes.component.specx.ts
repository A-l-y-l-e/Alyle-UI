import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderSizesComponent } from './slider-sizes.component';

describe('SliderSizesComponent', () => {
  let component: SliderSizesComponent;
  let fixture: ComponentFixture<SliderSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderSizesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
