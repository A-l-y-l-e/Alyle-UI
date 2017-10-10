import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LyCheckboxComponent } from './ly-checkbox.component';

describe('LyCheckboxComponent', () => {
  let component: LyCheckboxComponent;
  let fixture: ComponentFixture<LyCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LyCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
