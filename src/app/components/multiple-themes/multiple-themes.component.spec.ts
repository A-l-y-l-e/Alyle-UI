import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleThemesComponent } from './multiple-themes.component';

describe('MultipleThemesComponent', () => {
  let component: MultipleThemesComponent;
  let fixture: ComponentFixture<MultipleThemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleThemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
