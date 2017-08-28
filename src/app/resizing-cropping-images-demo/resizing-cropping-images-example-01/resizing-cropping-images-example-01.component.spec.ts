import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizingCroppingImagesExample01Component } from './resizing-cropping-images-example-01.component';

describe('ResizingCroppingImagesExample01Component', () => {
  let component: ResizingCroppingImagesExample01Component;
  let fixture: ComponentFixture<ResizingCroppingImagesExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizingCroppingImagesExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizingCroppingImagesExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
