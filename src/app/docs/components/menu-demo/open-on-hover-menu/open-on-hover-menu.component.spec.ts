import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOnHoverMenuComponent } from './open-on-hover-menu.component';

describe('OpenOnHoverMenuComponent', () => {
  let component: OpenOnHoverMenuComponent;
  let fixture: ComponentFixture<OpenOnHoverMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenOnHoverMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOnHoverMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
