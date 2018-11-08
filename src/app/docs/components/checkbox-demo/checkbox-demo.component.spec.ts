import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxDemoComponent } from './checkbox-demo.component';

describe('CheckboxDemoComponent', () => {
  let component: CheckboxDemoComponent;
  let fixture: ComponentFixture<CheckboxDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
