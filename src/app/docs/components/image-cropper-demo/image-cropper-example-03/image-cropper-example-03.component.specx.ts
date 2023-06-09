import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperExample03Component } from './image-cropper-example-03.component';

describe('ImageCropperExample03Component', () => {
  let component: ImageCropperExample03Component;
  let fixture: ComponentFixture<ImageCropperExample03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperExample03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperExample03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
