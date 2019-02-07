import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDemoComponent } from './dialog-demo.component';

describe('DialogDemoComponent', () => {
  let component: DialogDemoComponent;
  let fixture: ComponentFixture<DialogDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
