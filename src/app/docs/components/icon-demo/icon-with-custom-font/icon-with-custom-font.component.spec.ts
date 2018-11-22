import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconWithCustomFontComponent } from './icon-with-custom-font.component';

describe('IconWithCustomFontComponent', () => {
  let component: IconWithCustomFontComponent;
  let fixture: ComponentFixture<IconWithCustomFontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconWithCustomFontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconWithCustomFontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
