import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBadgeComponent } from './custom-badge.component';

describe('CustomBadgeComponent', () => {
  let component: CustomBadgeComponent;
  let fixture: ComponentFixture<CustomBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
