import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsetDividersComponent } from './inset-dividers.component';

describe('InsetDividersComponent', () => {
  let component: InsetDividersComponent;
  let fixture: ComponentFixture<InsetDividersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsetDividersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsetDividersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
