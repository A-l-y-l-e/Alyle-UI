import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWithCdkAutosizeComponent } from './field-with-cdk-autosize.component';

describe('FieldWithCdkAutosizeComponent', () => {
  let component: FieldWithCdkAutosizeComponent;
  let fixture: ComponentFixture<FieldWithCdkAutosizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldWithCdkAutosizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldWithCdkAutosizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
