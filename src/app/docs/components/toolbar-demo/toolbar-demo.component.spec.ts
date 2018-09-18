import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarDemoComponent } from './toolbar-demo.component';

describe('ToolbarDemoComponent', () => {
  let component: ToolbarDemoComponent;
  let fixture: ComponentFixture<ToolbarDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
