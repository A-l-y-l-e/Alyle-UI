import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizingCroppingImagesExample03Component } from './resizing-cropping-images-example-03.component';

describe('ResizingCroppingImagesExample03Component', () => {
  let component: ResizingCroppingImagesExample03Component;
  let fixture: ComponentFixture<ResizingCroppingImagesExample03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizingCroppingImagesExample03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizingCroppingImagesExample03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
