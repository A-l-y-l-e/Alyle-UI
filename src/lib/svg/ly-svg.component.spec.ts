import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LySvgComponent } from './ly-svg.component';

describe('LySvgComponent', () => {
  let component: LySvgComponent;
  let fixture: ComponentFixture<LySvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LySvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LySvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
