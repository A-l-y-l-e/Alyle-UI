import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarDemoComponent } from './snack-bar-demo.component';

describe('SnackBarDemoComponent', () => {
  let component: SnackBarDemoComponent;
  let fixture: ComponentFixture<SnackBarDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackBarDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
