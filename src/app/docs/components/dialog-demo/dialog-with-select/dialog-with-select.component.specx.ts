import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWithSelectComponent } from './dialog-with-select.component';

describe('DialogWithSelectComponent', () => {
  let component: DialogWithSelectComponent;
  let fixture: ComponentFixture<DialogWithSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogWithSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWithSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
