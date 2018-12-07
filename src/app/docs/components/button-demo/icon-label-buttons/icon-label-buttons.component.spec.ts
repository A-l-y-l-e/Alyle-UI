import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLabelButtonsComponent } from './icon-label-buttons.component';

describe('IconLabelButtonsComponent', () => {
  let component: IconLabelButtonsComponent;
  let fixture: ComponentFixture<IconLabelButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconLabelButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconLabelButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
