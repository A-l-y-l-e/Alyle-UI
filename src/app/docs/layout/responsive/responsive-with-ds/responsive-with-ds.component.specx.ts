import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveWithDsComponent } from './responsive-with-ds.component';

describe('ResponsiveWithDsComponent', () => {
  let component: ResponsiveWithDsComponent;
  let fixture: ComponentFixture<ResponsiveWithDsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveWithDsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveWithDsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
