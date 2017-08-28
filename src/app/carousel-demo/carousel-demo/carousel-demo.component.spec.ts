import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselDemoComponent } from './carousel-demo.component';

describe('CarouselDemoComponent', () => {
  let component: CarouselDemoComponent;
  let fixture: ComponentFixture<CarouselDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
