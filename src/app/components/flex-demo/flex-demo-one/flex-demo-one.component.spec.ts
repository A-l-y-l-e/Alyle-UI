import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexDemoOneComponent } from './flex-demo-one.component';

describe('FlexDemoOneComponent', () => {
  let component: FlexDemoOneComponent;
  let fixture: ComponentFixture<FlexDemoOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexDemoOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexDemoOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
