import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTabsComponent } from '@docs/layout/tabs-demo/basic-tabs/basic-tabs.component';

describe('BasicTabsComponent', () => {
  let component: BasicTabsComponent;
  let fixture: ComponentFixture<BasicTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
