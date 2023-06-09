import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarDenseComponent } from './toolbar-dense.component';

describe('ToolbarDenseComponent', () => {
  let component: ToolbarDenseComponent;
  let fixture: ComponentFixture<ToolbarDenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarDenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarDenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
