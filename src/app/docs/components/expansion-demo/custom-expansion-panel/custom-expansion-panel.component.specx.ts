import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomExpansionPanelComponent } from './custom-expansion-panel.component';

describe('CustomExpansionPanelComponent', () => {
  let component: CustomExpansionPanelComponent;
  let fixture: ComponentFixture<CustomExpansionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomExpansionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
