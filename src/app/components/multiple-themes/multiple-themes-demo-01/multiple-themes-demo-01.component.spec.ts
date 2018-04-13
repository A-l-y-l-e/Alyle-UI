import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleThemesDemo01Component } from './multiple-themes-demo-01.component';

describe('MultipleThemesDemo01Component', () => {
  let component: MultipleThemesDemo01Component;
  let fixture: ComponentFixture<MultipleThemesDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleThemesDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleThemesDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
