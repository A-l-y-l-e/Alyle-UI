import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsExample03Component } from './tabs-example-03.component';

describe('TabsExample03Component', () => {
  let component: TabsExample03Component;
  let fixture: ComponentFixture<TabsExample03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsExample03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsExample03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
