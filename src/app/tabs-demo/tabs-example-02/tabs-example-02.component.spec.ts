import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsExample02Component } from './tabs-example-02.component';

describe('TabsExample02Component', () => {
  let component: TabsExample02Component;
  let fixture: ComponentFixture<TabsExample02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsExample02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsExample02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
