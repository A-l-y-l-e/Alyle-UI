import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonExample01Component } from './icon-button-example-01.component';

describe('IconButtonExample01Component', () => {
  let component: IconButtonExample01Component;
  let fixture: ComponentFixture<IconButtonExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconButtonExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconButtonExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
