import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';

describe('TabsDemoComponent', () => {
  let component: TabsDemoComponent;
  let fixture: ComponentFixture<TabsDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
