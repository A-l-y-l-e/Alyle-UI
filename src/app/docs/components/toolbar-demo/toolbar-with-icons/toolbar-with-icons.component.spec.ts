import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarWithIconsComponent } from './toolbar-with-icons.component';

describe('ToolbarWithIconsComponent', () => {
  let component: ToolbarWithIconsComponent;
  let fixture: ComponentFixture<ToolbarWithIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarWithIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarWithIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
