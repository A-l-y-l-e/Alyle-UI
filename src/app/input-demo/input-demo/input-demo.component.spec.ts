import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDemoComponent } from './input-demo.component';

describe('InputDemoComponent', () => {
  let component: InputDemoComponent;
  let fixture: ComponentFixture<InputDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
