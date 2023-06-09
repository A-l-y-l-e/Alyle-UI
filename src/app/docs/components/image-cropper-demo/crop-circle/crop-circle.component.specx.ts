import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropCircleComponent } from './crop-circle.component';

describe('CropCircleComponent', () => {
  let component: CropCircleComponent;
  let fixture: ComponentFixture<CropCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
