import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsDynamicHeightComponent } from './tabs-dynamic-height.component';

describe('TabsDynamicHeightComponent', () => {
  let component: TabsDynamicHeightComponent;
  let fixture: ComponentFixture<TabsDynamicHeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsDynamicHeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsDynamicHeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
