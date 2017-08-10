import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsExample01Component } from './tabs-example-01.component';

describe('TabsExample01Component', () => {
  let component: TabsExample01Component;
  let fixture: ComponentFixture<TabsExample01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsExample01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsExample01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
