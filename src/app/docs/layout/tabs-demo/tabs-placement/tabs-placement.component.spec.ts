import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPlacementComponent } from './tabs-placement.component';

describe('TabsPlacementComponent', () => {
  let component: TabsPlacementComponent;
  let fixture: ComponentFixture<TabsPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
