import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuExample01Component } from './menu-example-01.component';

describe('MenuExample01Component', () => {
  let component: MenuExample01Component;
  let fixture: ComponentFixture<MenuExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
