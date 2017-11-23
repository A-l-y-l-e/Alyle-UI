import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveDemo01Component } from './responsive-demo-01.component';

describe('ResponsiveDemo01Component', () => {
  let component: ResponsiveDemo01Component;
  let fixture: ComponentFixture<ResponsiveDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
