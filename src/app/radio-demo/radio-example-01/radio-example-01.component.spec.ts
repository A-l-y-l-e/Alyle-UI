import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioExample01Component } from './radio-example-01.component';

describe('RadioExample01Component', () => {
  let component: RadioExample01Component;
  let fixture: ComponentFixture<RadioExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
