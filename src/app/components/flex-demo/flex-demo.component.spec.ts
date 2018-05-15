import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexDemoComponent } from './flex-demo.component';

describe('FlexDemoComponent', () => {
  let component: FlexDemoComponent;
  let fixture: ComponentFixture<FlexDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
