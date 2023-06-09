import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPlaygroundComponent } from './menu-playground.component';

describe('MenuPlaygroundComponent', () => {
  let component: MenuPlaygroundComponent;
  let fixture: ComponentFixture<MenuPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
