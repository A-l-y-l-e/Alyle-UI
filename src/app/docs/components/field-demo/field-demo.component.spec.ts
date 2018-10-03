import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldDemoComponent } from './field-demo.component';

describe('FieldDemoComponent', () => {
  let component: FieldDemoComponent;
  let fixture: ComponentFixture<FieldDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
