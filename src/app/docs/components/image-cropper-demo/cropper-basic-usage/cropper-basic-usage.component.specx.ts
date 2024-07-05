import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperBasicUsageComponent } from './cropper-basic-usage.component';

describe('CropperBasicUsageComponent', () => {
  let component: CropperBasicUsageComponent;
  let fixture: ComponentFixture<CropperBasicUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CropperBasicUsageComponent]
    });
    fixture = TestBed.createComponent(CropperBasicUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
