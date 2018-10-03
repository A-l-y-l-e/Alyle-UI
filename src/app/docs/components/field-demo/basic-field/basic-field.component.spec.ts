import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFieldComponent } from './basic-field.component';

describe('BasicFieldComponent', () => {
  let component: BasicFieldComponent;
  let fixture: ComponentFixture<BasicFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
