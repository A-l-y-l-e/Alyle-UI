import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDemoAutoLayoutComponent } from './grid-demo-auto-layout.component';

describe('GridDemoAutoLayoutComponent', () => {
  let component: GridDemoAutoLayoutComponent;
  let fixture: ComponentFixture<GridDemoAutoLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDemoAutoLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDemoAutoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
