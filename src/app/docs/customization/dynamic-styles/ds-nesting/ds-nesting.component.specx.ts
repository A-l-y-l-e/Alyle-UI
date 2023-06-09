import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsNestingComponent } from './ds-nesting.component';

describe('DsNestingComponent', () => {
  let component: DsNestingComponent;
  let fixture: ComponentFixture<DsNestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsNestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsNestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
