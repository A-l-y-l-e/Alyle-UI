import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDemo02Component } from './menu-demo-02.component';

describe('MenuDemo02Component', () => {
  let component: MenuDemo02Component;
  let fixture: ComponentFixture<MenuDemo02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDemo02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDemo02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
