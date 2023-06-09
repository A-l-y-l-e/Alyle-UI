import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldPlaygroundComponent } from './field-playground.component';

describe('FieldPlaygroundComponent', () => {
  let component: FieldPlaygroundComponent;
  let fixture: ComponentFixture<FieldPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
