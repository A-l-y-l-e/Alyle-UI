import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderPlaygroundComponent } from './slider-playground.component';

describe('SliderPlaygroundComponent', () => {
  let component: SliderPlaygroundComponent;
  let fixture: ComponentFixture<SliderPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
