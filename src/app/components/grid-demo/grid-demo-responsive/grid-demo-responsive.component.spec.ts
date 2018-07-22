import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDemoResponsiveComponent } from './grid-demo-responsive.component';

describe('GridDemoResponsiveComponent', () => {
  let component: GridDemoResponsiveComponent;
  let fixture: ComponentFixture<GridDemoResponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDemoResponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDemoResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
