import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWithLoadingStateComponent } from './button-with-loading-state.component';

describe('ButtonWithLoadingStateComponent', () => {
  let component: ButtonWithLoadingStateComponent;
  let fixture: ComponentFixture<ButtonWithLoadingStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonWithLoadingStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonWithLoadingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
