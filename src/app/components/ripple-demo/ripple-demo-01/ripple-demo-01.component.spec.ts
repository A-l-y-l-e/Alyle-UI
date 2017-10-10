import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RippleDemo01Component } from './ripple-demo-01.component';

describe('RippleDemo01Component', () => {
  let component: RippleDemo01Component;
  let fixture: ComponentFixture<RippleDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RippleDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RippleDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
