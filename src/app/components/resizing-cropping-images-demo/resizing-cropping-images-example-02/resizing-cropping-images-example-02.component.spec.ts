import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizingCroppingImagesExample02Component } from './resizing-cropping-images-example-02.component';

describe('ResizingCroppingImagesExample02Component', () => {
  let component: ResizingCroppingImagesExample02Component;
  let fixture: ComponentFixture<ResizingCroppingImagesExample02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizingCroppingImagesExample02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizingCroppingImagesExample02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
