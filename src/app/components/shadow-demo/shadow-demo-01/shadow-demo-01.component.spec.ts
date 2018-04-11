import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowDemo01Component } from './shadow-demo-01.component';

describe('ShadowDemo01Component', () => {
  let component: ShadowDemo01Component;
  let fixture: ComponentFixture<ShadowDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShadowDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
