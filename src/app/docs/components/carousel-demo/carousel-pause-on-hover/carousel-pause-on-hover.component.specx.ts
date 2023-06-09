import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselPauseOnHoverComponent } from './carousel-pause-on-hover.component';

describe('CarouselPauseOnHoverComponent', () => {
  let component: CarouselPauseOnHoverComponent;
  let fixture: ComponentFixture<CarouselPauseOnHoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselPauseOnHoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselPauseOnHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
