import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BgColorDemo01Component } from './bg-color-demo-01.component';

describe('BgColorDemo01Component', () => {
  let component: BgColorDemo01Component;
  let fixture: ComponentFixture<BgColorDemo01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgColorDemo01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgColorDemo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
