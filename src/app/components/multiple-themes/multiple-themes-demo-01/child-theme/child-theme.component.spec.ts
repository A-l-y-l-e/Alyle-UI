import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildThemeComponent } from './child-theme.component';

describe('ChildThemeComponent', () => {
  let component: ChildThemeComponent;
  let fixture: ComponentFixture<ChildThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
