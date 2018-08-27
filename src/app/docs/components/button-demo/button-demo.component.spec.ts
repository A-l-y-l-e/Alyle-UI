import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDemoComponent } from './button-demo.component';

describe('ButtonDemoComponent', () => {
  let component: ButtonDemoComponent;
  let fixture: ComponentFixture<ButtonDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
