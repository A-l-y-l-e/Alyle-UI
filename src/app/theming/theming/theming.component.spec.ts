import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemingComponent } from './theming.component';

describe('ThemingComponent', () => {
  let component: ThemingComponent;
  let fixture: ComponentFixture<ThemingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
