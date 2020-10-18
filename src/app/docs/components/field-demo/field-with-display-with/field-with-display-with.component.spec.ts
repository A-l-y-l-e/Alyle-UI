import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWithDisplayWithComponent } from './field-with-display-with.component';

describe('FieldWithDisplayWithComponent', () => {
  let component: FieldWithDisplayWithComponent;
  let fixture: ComponentFixture<FieldWithDisplayWithComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldWithDisplayWithComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldWithDisplayWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
