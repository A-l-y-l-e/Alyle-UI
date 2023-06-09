import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicBadgeComponent } from './basic-badge.component';

describe('BasicBadgeComponent', () => {
  let component: BasicBadgeComponent;
  let fixture: ComponentFixture<BasicBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
