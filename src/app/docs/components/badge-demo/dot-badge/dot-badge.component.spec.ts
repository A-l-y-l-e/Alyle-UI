import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotBadgeComponent } from './dot-badge.component';

describe('DotBadgeComponent', () => {
  let component: DotBadgeComponent;
  let fixture: ComponentFixture<DotBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
