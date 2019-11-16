import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperExample02Component } from './image-cropper-example-02.component';

describe('ImageCropperExample02Component', () => {
  let component: ImageCropperExample02Component;
  let fixture: ComponentFixture<ImageCropperExample02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperExample02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperExample02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
