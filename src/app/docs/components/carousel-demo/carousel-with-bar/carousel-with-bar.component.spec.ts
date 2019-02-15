import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselWithBarComponent } from './carousel-with-bar.component';

describe('CarouselWithBarComponent', () => {
  let component: CarouselWithBarComponent;
  let fixture: ComponentFixture<CarouselWithBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselWithBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselWithBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
