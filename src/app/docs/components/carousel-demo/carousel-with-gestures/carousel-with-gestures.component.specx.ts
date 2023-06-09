import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselWithGesturesComponent } from './carousel-with-gestures.component';

describe('CarouselWithGesturesComponent', () => {
  let component: CarouselWithGesturesComponent;
  let fixture: ComponentFixture<CarouselWithGesturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselWithGesturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselWithGesturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
