import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsReusableStylesComponent } from './ds-reusable-styles.component';

describe('DsReusableStylesComponent', () => {
  let component: DsReusableStylesComponent;
  let fixture: ComponentFixture<DsReusableStylesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsReusableStylesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsReusableStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
