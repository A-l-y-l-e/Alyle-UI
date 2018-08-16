import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsWithAsynchronouslyLoadingComponent } from './tabs-with-asynchronously-loading.component';

describe('TabsWithAsynchronouslyLoadingComponent', () => {
  let component: TabsWithAsynchronouslyLoadingComponent;
  let fixture: ComponentFixture<TabsWithAsynchronouslyLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsWithAsynchronouslyLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsWithAsynchronouslyLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
