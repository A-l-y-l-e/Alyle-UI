import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDialogComponent } from './basic-dialog.component';

describe('BasicDialogComponent', () => {
  let component: BasicDialogComponent;
  let fixture: ComponentFixture<BasicDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
