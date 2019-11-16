import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperDemoComponent } from './image-cropper-demo.component';

describe('ImageCropperDemoComponent', () => {
  let component: ImageCropperDemoComponent;
  let fixture: ComponentFixture<ImageCropperDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
