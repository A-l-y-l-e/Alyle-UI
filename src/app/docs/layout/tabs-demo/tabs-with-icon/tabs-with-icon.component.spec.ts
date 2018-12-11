import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsWithIconComponent } from './tabs-with-icon.component';

describe('TabsWithIconComponent', () => {
  let component: TabsWithIconComponent;
  let fixture: ComponentFixture<TabsWithIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsWithIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
