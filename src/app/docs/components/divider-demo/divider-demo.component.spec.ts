import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerDemoComponent } from './divider-demo.component';

describe('DividerDemoComponent', () => {
  let component: DividerDemoComponent;
  let fixture: ComponentFixture<DividerDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividerDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
