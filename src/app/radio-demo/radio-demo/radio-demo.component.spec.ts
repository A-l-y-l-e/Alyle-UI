import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioDemoComponent } from './radio-demo.component';

describe('RadioDemoComponent', () => {
  let component: RadioDemoComponent;
  let fixture: ComponentFixture<RadioDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
