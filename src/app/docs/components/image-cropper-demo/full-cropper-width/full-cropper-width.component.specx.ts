import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCropperWidthComponent } from './full-cropper-width.component';

describe('FullCropperWidthComponent', () => {
  let component: FullCropperWidthComponent;
  let fixture: ComponentFixture<FullCropperWidthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullCropperWidthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCropperWidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
