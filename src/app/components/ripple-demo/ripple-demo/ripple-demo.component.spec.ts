import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RippleDemoComponent } from './ripple-demo.component';

describe('RippleDemoComponent', () => {
  let component: RippleDemoComponent;
  let fixture: ComponentFixture<RippleDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RippleDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RippleDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
