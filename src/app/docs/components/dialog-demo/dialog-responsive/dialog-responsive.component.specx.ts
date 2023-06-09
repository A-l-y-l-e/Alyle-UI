import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResponsiveComponent } from './dialog-responsive.component';

describe('DialogResponsiveComponent', () => {
  let component: DialogResponsiveComponent;
  let fixture: ComponentFixture<DialogResponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
