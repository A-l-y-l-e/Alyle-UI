import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNgTemplateComponent } from './dialog-ng-template.component';

describe('DialogNgTemplateComponent', () => {
  let component: DialogNgTemplateComponent;
  let fixture: ComponentFixture<DialogNgTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogNgTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNgTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
