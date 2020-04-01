import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperWithDialogComponent } from './cropper-with-dialog.component';

describe('CropperWithDialogComponent', () => {
  let component: CropperWithDialogComponent;
  let fixture: ComponentFixture<CropperWithDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperWithDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropperWithDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
