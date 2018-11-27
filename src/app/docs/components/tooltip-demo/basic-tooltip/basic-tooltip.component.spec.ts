import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTooltipComponent } from './basic-tooltip.component';

describe('BasicTooltipComponent', () => {
  let component: BasicTooltipComponent;
  let fixture: ComponentFixture<BasicTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
