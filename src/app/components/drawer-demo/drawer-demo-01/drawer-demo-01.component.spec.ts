import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerDemo01Component } from './drawer-demo-01.component';

describe('DrawerDemo01Component', () => {
  let component: DrawerDemo01Component;
  let fixture: ComponentFixture<DrawerDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
