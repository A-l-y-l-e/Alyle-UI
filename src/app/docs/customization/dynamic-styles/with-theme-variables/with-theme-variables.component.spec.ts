import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithThemeVariablesComponent } from './with-theme-variables.component';

describe('WithThemeVariablesComponent', () => {
  let component: WithThemeVariablesComponent;
  let fixture: ComponentFixture<WithThemeVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithThemeVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithThemeVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
