import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsWithLazyLoadingComponent } from './tabs-with-lazy-loading.component';

describe('TabsWithLazyLoadingComponent', () => {
  let component: TabsWithLazyLoadingComponent;
  let fixture: ComponentFixture<TabsWithLazyLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsWithLazyLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsWithLazyLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
