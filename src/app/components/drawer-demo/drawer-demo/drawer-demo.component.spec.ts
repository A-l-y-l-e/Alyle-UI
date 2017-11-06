import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerDemoComponent } from './drawer-demo.component';

describe('DrawerDemoComponent', () => {
  let component: DrawerDemoComponent;
  let fixture: ComponentFixture<DrawerDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
