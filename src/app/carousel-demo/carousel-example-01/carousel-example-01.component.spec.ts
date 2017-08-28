import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselExample01Component } from './carousel-example-01.component';

describe('CarouselExample01Component', () => {
  let component: CarouselExample01Component;
  let fixture: ComponentFixture<CarouselExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
