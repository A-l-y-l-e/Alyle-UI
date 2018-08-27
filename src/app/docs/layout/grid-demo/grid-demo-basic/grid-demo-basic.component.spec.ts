import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDemoBasicComponent } from './grid-demo-basic.component';

describe('GridDemoBasicComponent', () => {
  let component: GridDemoBasicComponent;
  let fixture: ComponentFixture<GridDemoBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDemoBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDemoBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
