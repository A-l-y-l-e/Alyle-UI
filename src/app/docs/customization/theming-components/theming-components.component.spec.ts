import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemingComponentsComponent } from './theming-components.component';

describe('ThemingComponentsComponent', () => {
  let component: ThemingComponentsComponent;
  let fixture: ComponentFixture<ThemingComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemingComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemingComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
