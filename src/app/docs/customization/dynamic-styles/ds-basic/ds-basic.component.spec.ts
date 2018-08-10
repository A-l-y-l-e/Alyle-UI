import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsBasicComponent } from './ds-basic.component';

describe('DsBasicComponent', () => {
  let component: DsBasicComponent;
  let fixture: ComponentFixture<DsBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
