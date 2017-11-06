import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDemo01Component } from './menu-demo-01.component';

describe('MenuDemo01Component', () => {
  let component: MenuDemo01Component;
  let fixture: ComponentFixture<MenuDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
