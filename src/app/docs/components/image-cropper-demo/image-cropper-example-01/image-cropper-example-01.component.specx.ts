import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperExample01Component } from './image-cropper-example-01.component';

describe('ImageCropperExample01Component', () => {
  let component: ImageCropperExample01Component;
  let fixture: ComponentFixture<ImageCropperExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
