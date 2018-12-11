import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsAlignComponent } from './tabs-align.component';

describe('TabsAlignComponent', () => {
  let component: TabsAlignComponent;
  let fixture: ComponentFixture<TabsAlignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsAlignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsAlignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
