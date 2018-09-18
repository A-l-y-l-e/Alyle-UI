import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarBasicDemoComponent } from './toolbar-basic-demo.component';

describe('ToolbarBasicDemoComponent', () => {
  let component: ToolbarBasicDemoComponent;
  let fixture: ComponentFixture<ToolbarBasicDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarBasicDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarBasicDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
