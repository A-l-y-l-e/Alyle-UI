import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomTriggerComponent } from './select-custom-trigger.component';

describe('SelectCustomTriggerComponent', () => {
  let component: SelectCustomTriggerComponent;
  let fixture: ComponentFixture<SelectCustomTriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCustomTriggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCustomTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
