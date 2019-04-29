import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSliderComponent } from './basic-slider.component';

describe('BasicSliderComponent', () => {
  let component: BasicSliderComponent;
  let fixture: ComponentFixture<BasicSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
